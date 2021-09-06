import cdkExports from "./cdk-exports.json";

const config = {
  aws_project_region: cdkExports.PrsBackendStack.ProjectRegion,
  aws_user_pools_id: cdkExports.PrsBackendStack.UserPoolId,
  aws_user_pools_web_client_id: cdkExports.PrsBackendStack.UserPoolClientId,
  aws_appsync_graphqlEndpoint: cdkExports.PrsBackendStack.GraphQLAPIURL,
  aws_appsync_apiKey: cdkExports.PrsBackendStack.AppSyncAPIKey,
  aws_appsync_authenticationType: "API_KEY",
};

export default config;
