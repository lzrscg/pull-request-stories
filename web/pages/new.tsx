import { Amplify, API, Auth } from "aws-amplify";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

import awsconfig from "../aws-exports";
import Editor from "../components/editor";
import NewPostControlBar from "../components/new-post-control-bar";
import { createStory } from "../graphql/app-sync/mutations";
import { StoryInput } from "../graphql/app-sync-api";
import { IPullRequest } from "../interfaces/pull-request.interface";
import { IPullRequestDiff } from "../interfaces/pull-request-diff.interface";
import {
  getPullRequestDiffs,
  listAuthenticatedUsersPullRequests,
} from "../lib/utils";
Amplify.configure(awsconfig);

function NewPost() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState<string>("My First Pull Request");
  const [pullRequest, setPullRequest] = useState<IPullRequest | undefined>(
    undefined
  );
  const [diffs, setDiffs] = useState<IPullRequestDiff[] | undefined>(undefined);
  const [initialEditorContent, setInitialEditorContent] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string>("");
  const headerNavLinks = ["Create a Story"];

  type OptionType = { label: string; value: any };
  type OptionsType = Array<OptionType>;

  async function listPullRequestOptions(
    filterTerm: string
  ): Promise<OptionsType> {
    if (user) {
      const gitHubToken = user.attributes["custom:github_access_token"];
      return listAuthenticatedUsersPullRequests(gitHubToken).then(
        (pullRequests) => {
          return pullRequests
            .map((pullRequest) => {
              return {
                label: `${pullRequest.repositoryOwner}/${pullRequest.repositoryName}/${pullRequest.pullRequestNumber}`,
                value: pullRequest,
              };
            })
            .filter((pullRequestOption) => {
              return pullRequestOption.label.indexOf(filterTerm) !== -1;
            });
        }
      );
    } else {
      return [];
    }
  }

  async function createNewStory(story: StoryInput) {
    await API.graphql({
      query: createStory,
      variables: { story },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
  }

  function selectOption(selection: OptionType) {
    const { value } = selection;
    const gitHubToken = user.attributes["custom:github_access_token"];

    setPullRequest(value);

    getPullRequestDiffs(gitHubToken, value).then((diffs) => {
      const initialText =
        "Hi! Thank you for trying out an early version of the story editor. Eventually, there will be many rich-text editing features. However, for now the text must be written in markdown.\n\n" +
        "To learn more about markdown, check out this URL: https://guides.github.com/features/mastering-markdown\n\n" +
        "The JSX components below represent the file diffs. When you publish this story, they will render the code diffs in-line. These are the diffs that are available to you corresponding to changed files in your pull request. Paste them anywhere you'd like them to be rendered in the document and delete the ones you don't want to use.\n\n" +
        diffs
          .map((diff) => `<PullRequestDiff path="${diff.path}" />`)
          .join("\n\n");

      setDiffs(diffs);
      setInitialEditorContent(initialText);
    });
  }

  useEffect(() => {
    if (!user) {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          setUser(user);
        })
        .catch(() => Auth.federatedSignIn({ provider: "Github" } as any));
    }
  });

  const router = useRouter();

  return user ? (
    <div className="h-screen w-screen flex flex-col">
      <div className="w-full flex-grow flex-shrink overflow-y-scroll">
        <div className="max-w-3xl px-4 mx-auto sm:px-6 xl:max-w-5xl xl:px-0">
          <Head>
            <title>New Pull Request Story</title>
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
              rel="stylesheet"
            />
          </Head>
          <div className="flex flex-col justify-between">
            <header className="flex items-center justify-between py-10">
              <div>
                <Link href="/">
                  <div className="flex items-center justify-between">
                    <div className="hidden h-6 text-2xl font-semibold sm:block">
                      Pull Request Stories
                    </div>
                  </div>
                </Link>
              </div>
              <div className="flex items-center text-base leading-5">
                <div className="hidden sm:block">
                  {headerNavLinks.map((link) => (
                    <Link key={link} href={`/${link}`}>
                      <a className="p-1 font-medium text-gray-900 sm:p-4">
                        {link}
                      </a>
                    </Link>
                  ))}
                </div>
                {/*<MobileNav />*/}
              </div>
            </header>
            <main className="mb-auto">
              <article>
                <div className="xl:divide-y xl:divide-gray-200">
                  <header className="pt-6 xl:pb-6">
                    <div className="space-y-1 text-center">
                      <dl className="space-y-10">
                        <div>
                          <dd className="text-base font-medium leading-6 text-gray-500">
                            <time>
                              {new Date().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </time>
                          </dd>
                        </div>
                      </dl>
                      <div>
                        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
                          {title}
                        </h1>
                      </div>
                    </div>
                  </header>
                  <div
                    className="pb-8 divide-y divide-gray-200 xl:divide-y-0 xl:grid xl:grid-cols-4 xl:gap-x-6"
                    style={{ gridTemplateRows: "auto 1fr" }}
                  >
                    <dl className="pt-6 pb-10 xl:pt-11 xl:border-b xl:border-gray-200">
                      <dd>
                        <div className="col-span-3 sm:col-span-2 pb-8">
                          <label
                            htmlFor="company-website"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Title
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                              value={title}
                              onChange={(event) => setTitle(event.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="about"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Pull Request
                          </label>
                          <div className="mt-1">
                            <AsyncSelect
                              cacheOptions
                              defaultOptions
                              loadOptions={listPullRequestOptions}
                              onChange={selectOption as any}
                            />
                          </div>
                        </div>
                      </dd>
                    </dl>
                    <div className="divide-y divide-gray-200 xl:pb-0 xl:col-span-3 xl:row-span-2">
                      <div className="pt-10 pb-8 max-w-none">
                        <Editor
                          key={initialEditorContent}
                          initialContent={initialEditorContent}
                          pullRequest={pullRequest}
                          diffs={diffs}
                          onChange={(mdx) => setEditorContent(mdx)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </main>
          </div>
        </div>
      </div>
      <div className="flex-grow-0 flex-shrink">
        <NewPostControlBar
          onPublish={() => {
            const slug = title
              .split("")
              .filter((char) => char.match(/\w| |_|-/))
              .join("")
              .replace(/ /g, "-")
              .toLowerCase();
            createNewStory({
              title,
              content: editorContent,
              pullRequestPath: `${pullRequest?.repositoryOwner}/${pullRequest?.repositoryName}/pull/${pullRequest?.pullRequestNumber}`,
              slug,
            })
              .catch((e) => console.error(e))
              .then(() => router.push("/story/" + slug));
          }}
        />
      </div>
    </div>
  ) : null;
}

export default NewPost;
