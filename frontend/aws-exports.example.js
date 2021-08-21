import BackendStack from './cdk-exports.json'

const config = {
  aws_project_region: BackendStack.ProjectRegion,
  aws_user_pools_id: BackendStack.UserPoolId,
  aws_user_pools_web_client_id: BackendStack.UserPoolClientId,
  aws_appsync_graphqlEndpoint: BackendStack.GraphQLAPIURL,
  aws_appsync_apiKey: BackendStack.AppSyncAPIKey,
  aws_appsync_authenticationType: "API_KEY"
}

export default config