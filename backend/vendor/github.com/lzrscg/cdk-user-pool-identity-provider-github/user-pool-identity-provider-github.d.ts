import { CfnUserPoolIdentityProvider, UserPool } from '@aws-cdk/aws-cognito';
import { Construct } from '@aws-cdk/core';
/**
 * @stability stable
 */
export interface IUserPoolIdentityProviderGithubProps {
    /**
     * The user pool.
     *
     * @stability stable
     */
    userPool: UserPool;
    /**
     * The client id recognized by Github APIs.
     *
     * @stability stable
     */
    clientId: string;
    /**
     * The client secret to be accompanied with clientId for Github APIs to authenticate the client.
     *
     * @stability stable
     */
    clientSecret: string;
    /**
     * The Cognito hosted UI domain.
     *
     * @stability stable
     */
    cognitoHostedUiDomain: string;
    /**
     * The URL of the Git repository for the GitHub wrapper.
     *
     * @stability stable
     */
    gitUrl?: string;
    /**
     * The branch of ther Git repository to clone for the GitHub wrapper.
     *
     * @stability stable
     */
    gitBranch?: string;
}
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
export declare class UserPoolIdentityProviderGithub extends Construct {
    /**
     * @stability stable
     */
    userPoolIdentityProvider: CfnUserPoolIdentityProvider;
    /**
     * @stability stable
     */
    constructor(scope: Construct, id: string, props: IUserPoolIdentityProviderGithubProps);
}
