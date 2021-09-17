import "cross-fetch/polyfill";

import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";

export function githubClient(
  gitHubToken: string
): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    link: new HttpLink({
      uri: "https://api.github.com/graphql",
      headers: {
        authorization: `token ${gitHubToken}`,
      },
    }),
    cache: new InMemoryCache(),
  });
}
