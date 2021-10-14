# Pull Request Stories
[Pull Request Stoires](https://pullrequeststories.com) is a platform for developers to publish blog posts that go along with their code contributions. Read more about it [here](https://pullrequeststories.com/mission).

On the frontend, it is built using Next.js, Tailwind CSS, and the AWS Amplify client library. It interacts with GitHub's API as well as a custom AWS AppSync backend via GraphQL. The frontend is deployed serverlessly to AWS.

The backend is constructed using CDK. It utilizes AWS Lambda and DynamoDB. Accounts and authentication are handled via AWS Cognito. As of now, the frontend deployment is not being handled via CDK, although ultimately it should be.

## How to set up project locally
1. Install and configure the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) or otherwise [prepare your information for bootstrapping](https://docs.aws.amazon.com/cdk/latest/guide/cli.html#cli-bootstrap)
2. `npm install`
3. Create the file **.env** in the project root based off of the example values provided in **.env.example**
4. `cdk bootstrap`
5. You have now fully set up the backend and can begin backend development 🎉 To fully set up the web frontend, keep reading...
6. `npm run deploy:backend`
7. `cp web/aws-exports.example.js web/aws-exports.js`
8. The web is now fully set up ☺️ soon there will be an easy way to set up graphql codegen, however, in the meantime please refer to the AWS Amplify codegen documentation.

## FAQ

### Where do I learn more about how to develop on this project?

This application was initially built off of [this tutorial](https://github.com/dabit3/next.js-cdk-amplify-workshop). It is a great starting place if you are unfamiliar with the technologies used.

### How do I run the front-end locally?
After you have followed the setup instructions:

`npm run web` 

**The below is only necessary if you wish to use authentication locally. For example, if you wanted to develop the user experience for posting new stories. However, if you just want to work on unauthenticated routes (like the homepage) or you can easily bypass authentication with a workaround, you do not need to do this next part.**

You will also need to edit the `oauth` domain properties inside the file `aws-exports.js` in order to get authentication to work. For local development, it should look like this:

```
oauth: {
      domain: "auth.<YOUR DOMAIN HERE>",
      scope: [
        "phone",
        "email",
        "profile",
        "openid",
        "aws.cognito.signin.user.admin",
      ],
      redirectSignIn: "https://localhost:3000/new",
      redirectSignOut: "http://localhost:3000",
      clientId: cdkExports.PrsBackendStack.UserPoolClientId,
      responseType: "code",
    },
```

When deploying to production, replace `localhost:3000` with your actual domain.

### How can I contribute?
We always welcome and encourage pull requests. Take a look the GitHub issues for this project to see what we need help with. If you have an idea, feel free to start working on it yourself or propose it as an issue. Also, you can [chat with us on Discord](https://discord.gg/sV3vK3dB2M) to find out more ways you can help out.

### Can I copy this code or use it for some other purpose?
Yes.

## Acknowledgements
Thank you to [Nader Dabit](https://github.com/dabit3/) for [this tutorial](https://github.com/dabit3/next.js-cdk-amplify-workshop). Thank you to [Tailwind CSS](https://tailwindcss.com) for design inspiration. Thank you to [timlrx](https://github.com/timlrx) for implementing that design in [this MIT Licensed codebase](https://github.com/timlrx/tailwind-nextjs-starter-blog). Thank you to [Christophe Bougère](https://github.com/ChristopheBougere) and [Timothy Jones](https://github.com/TimothyJones) for creating an [easy](https://github.com/scenario-labs/cdk-user-pool-identity-provider-github) [way](https://github.com/TimothyJones/github-cognito-openid-wrapper) to use GitHub authentication with Cognito. Thank you to [Zack Kanter](https://twitter.com/zackkanter) for inspiring me to pursue serverless. Thank you to [Balaji Srinivasan](https://twitter.com/balajis) for philosophical inspiration. Thank you to [Grok](https://twitter.com/grokology) for being the first supporter and contributor to this project.
