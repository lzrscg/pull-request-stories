import "../../configureAmplify";

import { API } from "aws-amplify";
import { parseExtendedISODate } from "aws-date-utils";
import Head from "next/head";
import Link from "next/link";

import PullRequestStory from "../../components/pull-request-story";
import { getStoryBySlug, listStories } from "../../graphql/app-sync/queries";

// I'm just trying to get out the MVP lol
// eslint-disable-next-line
// @ts-ignore
export async function getServerSideProps({ params }) {
  const { slug } = params;
  const storyData: any = await API.graphql({
    query: getStoryBySlug,
    variables: { storySlug: slug },
  });

  return {
    props: {
      story: storyData.data.getStoryBySlug,
    },
  };
}

type Props = {
  story: any;
};

const Post: React.FC<Props> = function ({ story }) {
  type NavLink = {
    text: string;
    href: string;
  };
  const headerNavLinks: NavLink[] = [
    {
      text: "Create a Story",
      href: "/new",
    },
  ];

  return !story ? (
    <p>An error occurred</p>
  ) : (
    <div className="antialiased max-w-3xl px-4 mx-auto sm:px-6 xl:max-w-5xl xl:px-0">
      <Head>
        <title>{story.title} - Pull Request Stories</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="flex flex-col justify-between h-screen">
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
                <Link key={link.href} href={link.href}>
                  <a className="p-1 font-medium text-gray-900 sm:p-4">
                    {link.text}
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
                          {parseExtendedISODate(
                            story.publishedAt
                          ).toLocaleDateString("en-US", {
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
                      {story.title}
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
                    <span className="prose">
                      <p className="xl:border-none border rounded p-3">
                        Thank you for trying out Pull Request Stories. This is a
                        platform for telling the story for how and why you wrote
                        the code behind your PR. We have just released our alpha
                        website and have much more coming soon. To learn more
                        about the PR in this story click the link below:
                      </p>
                    </span>
                  </dd>
                </dl>
                <div className="divide-y divide-gray-200 xl:pb-0 xl:col-span-3 xl:row-span-2">
                  <div className="pt-10 pb-8 max-w-none">
                    <PullRequestStory markdown={story.content} />
                  </div>
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};

export default Post;
