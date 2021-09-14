import * as cdk from '@aws-cdk/core'
import * as cognito from '@aws-cdk/aws-cognito'
import * as appsync from '@aws-cdk/aws-appsync'
import * as ddb from '@aws-cdk/aws-dynamodb'
import * as lambda from '@aws-cdk/aws-lambda'
import * as route53 from '@aws-cdk/aws-route53'
import * as route53targets from '@aws-cdk/aws-route53-targets'
import * as acm from '@aws-cdk/aws-certificatemanager';
import { UserPoolIdentityProviderGithub } from '../vendor/github.com/lzrscg/cdk-user-pool-identity-provider-github'

require('dotenv').config()

export class PrsBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const domainName = process.env.DOMAIN_NAME;
    const githubClientId = process.env.GITHUB_CLIENT_ID;
    const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

    if(!domainName) {
      console.error(`A domain needs to be configured with Route 53. Please create a public hosted zone.
      
      Instructions via console: 
      https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingHostedZone.html

      Sample CDK:
      const hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
        zoneName: domainName
      });
      `);
      throw new Error('No DOMAIN_NAME environment variable found. See .env.example');
    }

    if(!githubClientId) {
      throw new Error('No GITHUB_CLIENT_ID environment variable found. See .env.example');
    }

    if(!githubClientSecret) {
      throw new Error('No GITHUB_CLIENT_SECRET environment variable found. See .env.example');
    }

    const hostedZone = route53.PublicHostedZone.fromLookup(this, 'HostedZone', { domainName });

    const certificate = new acm.DnsValidatedCertificate(this, 'CrossRegionCertificate', {
      domainName: `*.${domainName}`,
      hostedZone: hostedZone,
      region: 'us-east-1',
    });

    const userPool = new cognito.UserPool(this, 'PrsUserPool', {
      selfSignUpEnabled: true,
      customAttributes: {
        github_access_token: new cognito.StringAttribute({ mutable: true }),
      },

    });

    const userPoolDomainName = `auth.${domainName}`;

    const userPoolDomain = new cognito.UserPoolDomain(this, 'UserPoolDomain', {
      userPool,
      customDomain: {
        domainName: userPoolDomainName,
        certificate,
      },
    });

    const userPoolDomainTarget = new route53targets.UserPoolDomainTarget(userPoolDomain);

    new route53.ARecord(this, 'UserPoolAliasRecord', {
      zone: hostedZone,
      recordName: userPoolDomainName,
      target: route53.RecordTarget.fromAlias(userPoolDomainTarget),
    });

    const userPoolIdentityProviderGithub = new UserPoolIdentityProviderGithub(this, 'UserPoolIdentityProviderGithub', {
      userPool,
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      cognitoHostedUiDomain: `https://${userPoolDomainName}`,
      gitUrl: 'https://github.com/lzrscg/github-cognito-openid-wrapper',
      gitBranch: 'v1.2.3',
    });

    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      oAuth: {
        callbackUrls: [`https://${domainName}/new`, `http://localhost:3000/new`],
        logoutUrls: [`https://${domainName}`, 'http://localhost:3000'],
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.custom('Github')
      ],
    });
    userPoolClient.node.addDependency(userPoolIdentityProviderGithub);

    const api = new appsync.GraphqlApi(this, 'PrsApp', {
      name: "PrsApp",
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      schema: appsync.Schema.fromAsset('./graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          }
        }]
      },
    });

    const postLambda = new lambda.Function(this, 'AppSyncPostHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('lambda-fns'),
      memorySize: 1024
    })
    
    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', postLambda)

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getStoryBySlug"
    })
    
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listStories"
    })

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "storiesByUsername"
    })
    
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createStory"
    })
    
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteStory"
    })
    
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updateStory"
    })

    const table = new ddb.Table(this, 'Table', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'slug',
        type: ddb.AttributeType.STRING,
      },
    })

    table.addGlobalSecondaryIndex({
      indexName: "storiesByUsername",
      partitionKey: {
        name: "owner",
        type: ddb.AttributeType.STRING,
      }
    })

    // enable the Lambda function to access the DynamoDB table (using IAM)
    table.grantFullAccess(postLambda)
    
    // Create an environment variable that we will use in the function code
    postLambda.addEnvironment('TABLE', table.tableName);

    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl
    })

    new cdk.CfnOutput(this, "GraphQLAPIId", {
      value: api.apiId
    })

    new cdk.CfnOutput(this, 'AppSyncAPIKey', {
      value: api.apiKey || ''
    })
  
    new cdk.CfnOutput(this, 'ProjectRegion', {
      value: this.region
    })

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId
    })

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId
    })

    new cdk.CfnOutput(this, "HostedZoneName", {
      value: hostedZone.zoneName
    })

    new cdk.CfnOutput(this, "HostedZoneId", {
      value: hostedZone.hostedZoneId
    })

    new cdk.CfnOutput(this, "CertificateArn", {
      value: certificate.certificateArn
    })
  }
}