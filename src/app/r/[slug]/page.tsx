import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { INFINITE_SCROLLING } from "@/config";
import { notFound } from "next/navigation";

import MiniCreatePost from "@/components/ui/MiniCreatePost";
import PostFeed from "@/components/ui/PostFeed";

interface pageProps {
  params: {
    slug: string;
  };
}
const page = async ({ params }: pageProps) => {
  const { slug } = params;
  const session = await getAuthSession();
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy:{
          createdAt: 'desc'

        },
        take: INFINITE_SCROLLING,
      },
    },
  });
 
  if (!subreddit) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
      <PostFeed  initialPosts={subreddit.posts} subredditName={subreddit.name}/>
    </>
  );
};

export default page;
