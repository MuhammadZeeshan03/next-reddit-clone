import { getAuthSession } from "@/lib/auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { subredditSubscriptionValidator } from "@/lib/validators/subreddit";
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();

    const { subredditId } = subredditSubscriptionValidator.parse(body);
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });
    if (subscriptionExists) {
      return new Response("Already subscribed", { status: 400 });
    }

    await db.subscription.create({
      data: {
        subredditId,
        userId: session.user.id,
      },
    });

    return new Response(subredditId);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid Request data Passed", { status: 422 });
    }
    return new Response("Could not subscribe, please try again later.", {
      status: 500,
    });
  }
}
