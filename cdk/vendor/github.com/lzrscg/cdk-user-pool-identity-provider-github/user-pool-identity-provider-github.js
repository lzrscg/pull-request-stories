"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolIdentityProviderGithub = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_apigateway_1 = require("@aws-cdk/aws-apigateway");
const aws_cognito_1 = require("@aws-cdk/aws-cognito");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
/**
 * GitHub OpenID Connect Wrapper for Cognito.
 *
 * @stability stable
 * @example
 *
 * new UserPoolIdentityProviderGithub(this, 'UserPoolIdentityProviderGithub', {
 *   userPool: new UserPool(stack, 'UserPool'),
 *   clientId: 'myClientId',
 *   clientSeret: 'myClientSecret',
 *   cognitoHostedUiDomain: 'https://auth.domain.com',
 * });
 */
class UserPoolIdentityProviderGithub extends core_1.Construct {
    /**
     * @stability stable
     */
    constructor(scope, id, props) {
        var _b, _c;
        super(scope, id);
        const api = new aws_apigateway_1.RestApi(this, 'RestApi');
        const wellKnownResource = api.root.addResource('.well-known');
        const commonFunctionProps = {
            code: aws_lambda_1.Code.fromDockerBuild(__dirname, {
                buildArgs: {
                    GIT_URL: (_b = props.gitUrl) !== null && _b !== void 0 ? _b : 'https://github.com/TimothyJones/github-cognito-openid-wrapper',
                    GIT_BRANCH: (_c = props.gitBranch) !== null && _c !== void 0 ? _c : 'v1.2.0',
                },
            }),
            environment: {
                GITHUB_CLIENT_ID: props.clientId,
                GITHUB_CLIENT_SECRET: props.clientSecret,
                COGNITO_REDIRECT_URI: `${props.cognitoHostedUiDomain}/oauth2/idpresponse`,
                GITHUB_API_URL: 'https://api.github.com',
                GITHUB_LOGIN_URL: 'https://github.com',
            },
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            timeout: core_1.Duration.minutes(15),
        };
        const openIdDiscoveryFunction = new aws_lambda_1.Function(this, 'OpenIdDiscoveryFunction', {
            ...commonFunctionProps,
            handler: 'openIdConfiguration.handler',
        });
        const openIdConfigurationResource = wellKnownResource.addResource('openid-configuration');
        openIdConfigurationResource.addMethod('GET', new aws_apigateway_1.LambdaIntegration(openIdDiscoveryFunction));
        const authorizeFunction = new aws_lambda_1.Function(this, 'AuthorizeFunction', {
            ...commonFunctionProps,
            handler: 'authorize.handler',
        });
        const authorizeResource = api.root.addResource('authorize');
        authorizeResource.addMethod('GET', new aws_apigateway_1.LambdaIntegration(authorizeFunction));
        const tokenFunction = new aws_lambda_1.Function(this, 'TokenFunction', {
            ...commonFunctionProps,
            handler: 'token.handler',
        });
        const tokenResource = api.root.addResource('token');
        tokenResource.addMethod('GET', new aws_apigateway_1.LambdaIntegration(tokenFunction));
        tokenResource.addMethod('POST', new aws_apigateway_1.LambdaIntegration(tokenFunction));
        const userInfoFunction = new aws_lambda_1.Function(this, 'UserInfoFunction', {
            ...commonFunctionProps,
            handler: 'userinfo.handler',
        });
        const userInfoResource = api.root.addResource('userinfo');
        userInfoResource.addMethod('GET', new aws_apigateway_1.LambdaIntegration(userInfoFunction));
        userInfoResource.addMethod('POST', new aws_apigateway_1.LambdaIntegration(userInfoFunction));
        const jwksFunction = new aws_lambda_1.Function(this, 'JwksFunction', {
            ...commonFunctionProps,
            handler: 'jwks.handler',
        });
        const jwksJsonResource = wellKnownResource.addResource('jwks.json');
        jwksJsonResource.addMethod('GET', new aws_apigateway_1.LambdaIntegration(jwksFunction));
        this.userPoolIdentityProvider = new aws_cognito_1.CfnUserPoolIdentityProvider(this, 'UserPoolIdentityProviderGithub', {
            providerName: 'Github',
            providerDetails: {
                client_id: props.clientId,
                client_secret: props.clientSecret,
                attributes_request_method: 'GET',
                oidc_issuer: api.url,
                authorize_scopes: 'openid read:user user:email',
                // For some reason, Cognito is unable to do OpenID Discovery.
                authorize_url: `${api.url}/authorize`,
                token_url: `${api.url}/token`,
                attributes_url: `${api.url}/userinfo`,
                jwks_uri: `${api.url}/.well-known/jwks.json`,
            },
            providerType: 'OIDC',
            attributeMapping: {
                username: 'sub',
                email: 'email',
                email_verified: 'email_verified',
                name: 'name',
                picture: 'picture',
                preferred_username: 'preferred_username',
                profile: 'profile',
                updated_at: 'updated_at',
                website: 'website',
            },
            userPoolId: props.userPool.userPoolId,
        });
    }
}
exports.UserPoolIdentityProviderGithub = UserPoolIdentityProviderGithub;
_a = JSII_RTTI_SYMBOL_1;
UserPoolIdentityProviderGithub[_a] = { fqn: "cdk-user-pool-identity-provider-github.UserPoolIdentityProviderGithub", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLWlkZW50aXR5LXByb3ZpZGVyLWdpdGh1Yi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91c2VyLXBvb2wtaWRlbnRpdHktcHJvdmlkZXItZ2l0aHViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQXFFO0FBQ3JFLHNEQUE2RTtBQUM3RSxvREFBOEQ7QUFDOUQsd0NBQW9EOzs7Ozs7Ozs7Ozs7OztBQWtCcEQsTUFBYSw4QkFBK0IsU0FBUSxnQkFBUzs7OztJQUczRCxZQUNFLEtBQWdCLEVBQ2hCLEVBQVUsRUFDVixLQUEyQzs7UUFFM0MsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEdBQUcsR0FBRyxJQUFJLHdCQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXpDLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFOUQsTUFBTSxtQkFBbUIsR0FBRztZQUMxQixJQUFJLEVBQUUsaUJBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFO2dCQUNwQyxTQUFTLEVBQUU7b0JBQ1QsT0FBTyxRQUFFLEtBQUssQ0FBQyxNQUFNLG1DQUFJLCtEQUErRDtvQkFDeEYsVUFBVSxRQUFFLEtBQUssQ0FBQyxTQUFTLG1DQUFJLFFBQVE7aUJBQ3hDO2FBQ0YsQ0FBQztZQUNGLFdBQVcsRUFBRTtnQkFDWCxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsUUFBUTtnQkFDaEMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLFlBQVk7Z0JBQ3hDLG9CQUFvQixFQUFFLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixxQkFBcUI7Z0JBQ3pFLGNBQWMsRUFBRSx3QkFBd0I7Z0JBQ3hDLGdCQUFnQixFQUFFLG9CQUFvQjthQUN2QztZQUNELE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsT0FBTyxFQUFFLGVBQVEs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QUcsQ0FBQyxHQUFHLFFBQVE7Z0JBQzdCLGNBQWMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLFdBQVc7Z0JBQ3JDLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLHdCQUF3QjthQUM3QztZQUNELFlBQVksRUFBRSxNQUFNO1lBQ3BCLGdCQUFnQixFQUFFO2dCQUNoQixRQUFRLEVBQUUsS0FBSztnQkFDZixLQUFLLEVBQUUsT0FBTztnQkFDZCxjQUFjLEVBQUUsZ0JBQWdCO2dCQUNoQyxJQUFJLEVBQUUsTUFBTTtnQkFDWixPQUFPLEVBQUUsU0FBUztnQkFDbEIsa0JBQWtCLEVBQUUsb0JBQW9CO2dCQUN4QyxPQUFPLEVBQUUsU0FBUztnQkFDbEIsVUFBVSxFQUFFLFlBQVk7Z0JBQ3hCLE9BQU8sRUFBRSxTQUFTO2FBQ25CO1lBQ0QsVUFBVSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVTtTQUN0QyxDQUNGLENBQUM7SUFDSixDQUFDOztBQS9ISCx3RUFnSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMYW1iZGFJbnRlZ3JhdGlvbiwgUmVzdEFwaSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5JztcbmltcG9ydCB7IENmblVzZXJQb29sSWRlbnRpdHlQcm92aWRlciwgVXNlclBvb2wgfSBmcm9tICdAYXdzLWNkay9hd3MtY29nbml0byc7XG5pbXBvcnQgeyBDb2RlLCBGdW5jdGlvbiwgUnVudGltZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJHaXRodWJQcm9wcyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIHVzZXJQb29sOiBVc2VyUG9vbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICBjbGllbnRJZDogc3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgY2xpZW50U2VjcmV0OiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIGNvZ25pdG9Ib3N0ZWRVaURvbWFpbjogc3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIGdpdFVybD86IHN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgZ2l0QnJhbmNoPzogc3RyaW5nO1xufVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5leHBvcnQgY2xhc3MgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyR2l0aHViIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHVzZXJQb29sSWRlbnRpdHlQcm92aWRlcjogQ2ZuVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHNjb3BlOiBDb25zdHJ1Y3QsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBwcm9wczogSVVzZXJQb29sSWRlbnRpdHlQcm92aWRlckdpdGh1YlByb3BzLFxuICApIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IFJlc3RBcGkodGhpcywgJ1Jlc3RBcGknKTtcblxuICAgIGNvbnN0IHdlbGxLbm93blJlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJy53ZWxsLWtub3duJyk7XG5cbiAgICBjb25zdCBjb21tb25GdW5jdGlvblByb3BzID0ge1xuICAgICAgY29kZTogQ29kZS5mcm9tRG9ja2VyQnVpbGQoX19kaXJuYW1lLCB7XG4gICAgICAgIGJ1aWxkQXJnczoge1xuICAgICAgICAgIEdJVF9VUkw6IHByb3BzLmdpdFVybCA/PyAnaHR0cHM6Ly9naXRodWIuY29tL1RpbW90aHlKb25lcy9naXRodWItY29nbml0by1vcGVuaWQtd3JhcHBlcicsXG4gICAgICAgICAgR0lUX0JSQU5DSDogcHJvcHMuZ2l0QnJhbmNoID8/ICd2MS4yLjAnLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBHSVRIVUJfQ0xJRU5UX0lEOiBwcm9wcy5jbGllbnRJZCxcbiAgICAgICAgR0lUSFVCX0NMSUVOVF9TRUNSRVQ6IHByb3BzLmNsaWVudFNlY3JldCxcbiAgICAgICAgQ09HTklUT19SRURJUkVDVF9VUkk6IGAke3Byb3BzLmNvZ25pdG9Ib3N0ZWRVaURvbWFpbn0vb2F1dGgyL2lkcHJlc3BvbnNlYCxcbiAgICAgICAgR0lUSFVCX0FQSV9VUkw6ICdodHRwczovL2FwaS5naXRodWIuY29tJyxcbiAgICAgICAgR0lUSFVCX0xPR0lOX1VSTDogJ2h0dHBzOi8vZ2l0aHViLmNvbScsXG4gICAgICB9LFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLm1pbnV0ZXMoMTUpLFxuICAgIH07XG4gICAgY29uc3Qgb3BlbklkRGlzY292ZXJ5RnVuY3Rpb24gPSBuZXcgRnVuY3Rpb24oXG4gICAgICB0aGlzLFxuICAgICAgJ09wZW5JZERpc2NvdmVyeUZ1bmN0aW9uJyxcbiAgICAgIHtcbiAgICAgICAgLi4uY29tbW9uRnVuY3Rpb25Qcm9wcyxcbiAgICAgICAgaGFuZGxlcjogJ29wZW5JZENvbmZpZ3VyYXRpb24uaGFuZGxlcicsXG4gICAgICB9LFxuICAgICk7XG4gICAgY29uc3Qgb3BlbklkQ29uZmlndXJhdGlvblJlc291cmNlID0gd2VsbEtub3duUmVzb3VyY2UuYWRkUmVzb3VyY2UoXG4gICAgICAnb3BlbmlkLWNvbmZpZ3VyYXRpb24nLFxuICAgICk7XG4gICAgb3BlbklkQ29uZmlndXJhdGlvblJlc291cmNlLmFkZE1ldGhvZChcbiAgICAgICdHRVQnLFxuICAgICAgbmV3IExhbWJkYUludGVncmF0aW9uKG9wZW5JZERpc2NvdmVyeUZ1bmN0aW9uKSxcbiAgICApO1xuXG4gICAgY29uc3QgYXV0aG9yaXplRnVuY3Rpb24gPSBuZXcgRnVuY3Rpb24odGhpcywgJ0F1dGhvcml6ZUZ1bmN0aW9uJywge1xuICAgICAgLi4uY29tbW9uRnVuY3Rpb25Qcm9wcyxcbiAgICAgIGhhbmRsZXI6ICdhdXRob3JpemUuaGFuZGxlcicsXG4gICAgfSk7XG4gICAgY29uc3QgYXV0aG9yaXplUmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnYXV0aG9yaXplJyk7XG4gICAgYXV0aG9yaXplUmVzb3VyY2UuYWRkTWV0aG9kKFxuICAgICAgJ0dFVCcsXG4gICAgICBuZXcgTGFtYmRhSW50ZWdyYXRpb24oYXV0aG9yaXplRnVuY3Rpb24pLFxuICAgICk7XG5cbiAgICBjb25zdCB0b2tlbkZ1bmN0aW9uID0gbmV3IEZ1bmN0aW9uKHRoaXMsICdUb2tlbkZ1bmN0aW9uJywge1xuICAgICAgLi4uY29tbW9uRnVuY3Rpb25Qcm9wcyxcbiAgICAgIGhhbmRsZXI6ICd0b2tlbi5oYW5kbGVyJyxcbiAgICB9KTtcbiAgICBjb25zdCB0b2tlblJlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3Rva2VuJyk7XG4gICAgdG9rZW5SZXNvdXJjZS5hZGRNZXRob2QoXG4gICAgICAnR0VUJyxcbiAgICAgIG5ldyBMYW1iZGFJbnRlZ3JhdGlvbih0b2tlbkZ1bmN0aW9uKSxcbiAgICApO1xuICAgIHRva2VuUmVzb3VyY2UuYWRkTWV0aG9kKFxuICAgICAgJ1BPU1QnLFxuICAgICAgbmV3IExhbWJkYUludGVncmF0aW9uKHRva2VuRnVuY3Rpb24pLFxuICAgICk7XG5cbiAgICBjb25zdCB1c2VySW5mb0Z1bmN0aW9uID0gbmV3IEZ1bmN0aW9uKHRoaXMsICdVc2VySW5mb0Z1bmN0aW9uJywge1xuICAgICAgLi4uY29tbW9uRnVuY3Rpb25Qcm9wcyxcbiAgICAgIGhhbmRsZXI6ICd1c2VyaW5mby5oYW5kbGVyJyxcbiAgICB9KTtcbiAgICBjb25zdCB1c2VySW5mb1Jlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3VzZXJpbmZvJyk7XG4gICAgdXNlckluZm9SZXNvdXJjZS5hZGRNZXRob2QoXG4gICAgICAnR0VUJyxcbiAgICAgIG5ldyBMYW1iZGFJbnRlZ3JhdGlvbih1c2VySW5mb0Z1bmN0aW9uKSxcbiAgICApO1xuICAgIHVzZXJJbmZvUmVzb3VyY2UuYWRkTWV0aG9kKFxuICAgICAgJ1BPU1QnLFxuICAgICAgbmV3IExhbWJkYUludGVncmF0aW9uKHVzZXJJbmZvRnVuY3Rpb24pLFxuICAgICk7XG5cbiAgICBjb25zdCBqd2tzRnVuY3Rpb24gPSBuZXcgRnVuY3Rpb24odGhpcywgJ0p3a3NGdW5jdGlvbicsIHtcbiAgICAgIC4uLmNvbW1vbkZ1bmN0aW9uUHJvcHMsXG4gICAgICBoYW5kbGVyOiAnandrcy5oYW5kbGVyJyxcbiAgICB9KTtcbiAgICBjb25zdCBqd2tzSnNvblJlc291cmNlID0gd2VsbEtub3duUmVzb3VyY2UuYWRkUmVzb3VyY2UoJ2p3a3MuanNvbicpO1xuICAgIGp3a3NKc29uUmVzb3VyY2UuYWRkTWV0aG9kKFxuICAgICAgJ0dFVCcsXG4gICAgICBuZXcgTGFtYmRhSW50ZWdyYXRpb24oandrc0Z1bmN0aW9uKSxcbiAgICApO1xuXG4gICAgdGhpcy51c2VyUG9vbElkZW50aXR5UHJvdmlkZXIgPSBuZXcgQ2ZuVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyKFxuICAgICAgdGhpcyxcbiAgICAgICdVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJHaXRodWInLFxuICAgICAge1xuICAgICAgICBwcm92aWRlck5hbWU6ICdHaXRodWInLFxuICAgICAgICBwcm92aWRlckRldGFpbHM6IHtcbiAgICAgICAgICBjbGllbnRfaWQ6IHByb3BzLmNsaWVudElkLFxuICAgICAgICAgIGNsaWVudF9zZWNyZXQ6IHByb3BzLmNsaWVudFNlY3JldCxcbiAgICAgICAgICBhdHRyaWJ1dGVzX3JlcXVlc3RfbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBvaWRjX2lzc3VlcjogYXBpLnVybCxcbiAgICAgICAgICBhdXRob3JpemVfc2NvcGVzOiAnb3BlbmlkIHJlYWQ6dXNlciB1c2VyOmVtYWlsJyxcbiAgICAgICAgICAvLyBGb3Igc29tZSByZWFzb24sIENvZ25pdG8gaXMgdW5hYmxlIHRvIGRvIE9wZW5JRCBEaXNjb3ZlcnkuXG4gICAgICAgICAgYXV0aG9yaXplX3VybDogYCR7YXBpLnVybH0vYXV0aG9yaXplYCxcbiAgICAgICAgICB0b2tlbl91cmw6IGAke2FwaS51cmx9L3Rva2VuYCxcbiAgICAgICAgICBhdHRyaWJ1dGVzX3VybDogYCR7YXBpLnVybH0vdXNlcmluZm9gLFxuICAgICAgICAgIGp3a3NfdXJpOiBgJHthcGkudXJsfS8ud2VsbC1rbm93bi9qd2tzLmpzb25gLFxuICAgICAgICB9LFxuICAgICAgICBwcm92aWRlclR5cGU6ICdPSURDJyxcbiAgICAgICAgYXR0cmlidXRlTWFwcGluZzoge1xuICAgICAgICAgIHVzZXJuYW1lOiAnc3ViJyxcbiAgICAgICAgICBlbWFpbDogJ2VtYWlsJyxcbiAgICAgICAgICBlbWFpbF92ZXJpZmllZDogJ2VtYWlsX3ZlcmlmaWVkJyxcbiAgICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgICAgcGljdHVyZTogJ3BpY3R1cmUnLFxuICAgICAgICAgIHByZWZlcnJlZF91c2VybmFtZTogJ3ByZWZlcnJlZF91c2VybmFtZScsXG4gICAgICAgICAgcHJvZmlsZTogJ3Byb2ZpbGUnLFxuICAgICAgICAgIHVwZGF0ZWRfYXQ6ICd1cGRhdGVkX2F0JyxcbiAgICAgICAgICB3ZWJzaXRlOiAnd2Vic2l0ZScsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJQb29sSWQ6IHByb3BzLnVzZXJQb29sLnVzZXJQb29sSWQsXG4gICAgICB9LFxuICAgICk7XG4gIH1cbn1cbiJdfQ==