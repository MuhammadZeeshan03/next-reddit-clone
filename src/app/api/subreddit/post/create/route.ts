import { getAuthSession } from "@/lib/auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { postValidator } from "@/lib/validators/post";
export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }
        const body = await req.json();

        const { subredditId, title, content } = postValidator.parse(body);

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session.user.id,
            },
        });
        if (!subscriptionExists) {
            return new Response("Subscribe to Post", { status: 400 });
        }

        await db.post.create({
            data: {
                title,
                content,
                authorId: session.user.id,
                subredditId,

            },
        });

        return new Response('OK');
    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error(err);
            return new Response("Invalid Request data Passed", { status: 422 });
        }
        return new Response("Could not post to subreddit at this time, Please try again later", {
            status: 500,
        });
    }
}
