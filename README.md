# Pull Request Stories

## How to set up project locally
1. Install and configure AWS CDK
2. `npm install`
3. `cd backend/lambda && npm install` (soon this will no longer be necessary)
4. Create the file **.env** in the project root based off of the example values provided in **.env.example**
5. You have now fully set up the backend and can begin backend development 🎉 To fully set up the web frontend, keep reading...
6. `npm run build && cdk deploy -O web/cdk-exports.json` (run command from project root)
7. `cp web/aws-exports.example.js web/aws-exports.js`
8. The web is now fully set up ☺️ soon there will be an easy way to set up graphql codegen, however, in the meantime please refer to the AWS Amplify codegen documentation.
