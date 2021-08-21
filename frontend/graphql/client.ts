import "cross-fetch/polyfill";

import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";

export function githubClient(): ApolloClient<NormalizedCacheObject> {
  /**
   * Disabling authentication for easy development set up. Eventually this will be replaced with OAuth anyway.
   */
  if (!process.env.GITHUB_TOKEN) {
    console.error(
      //throw new Error(
      "You need to provide a Github personal access token as `GITHUB_TOKEN` env variable. See README for more info."
    );
  }

  return new ApolloClient({
    link: new HttpLink({
      uri: "https://api.github.com/graphql",
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }),
    cache: new InMemoryCache(),
  });
}
