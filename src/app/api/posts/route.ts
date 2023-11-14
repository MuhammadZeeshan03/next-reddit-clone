import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: Request) {
    const url = new URL(req.url)

    const session = await getAuthSession()

    let followedCommunutiesIds: string[] = []

    if (session) {
        const followedCommunities = await db.subscription.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                subreddit: true
            },
        })
        followedCommunutiesIds = followedCommunities.map(({ subreddit }) => subreddit.id)
    }

    try {
        const { limit, page, subredditName } = z.object({
            limit: z.string(),
            page: z.string(),
            subredditName: z.string().nullish().optional()
        }).parse({
            subredditName: url.searchParams.get('subredditName'),
            limit: url.searchParams.get('limit'),
            page: url.searchParams.get('page'),
        })


        let whereClause = {}

        if (subredditName) {
            whereClause = {
                subreddit: {
                    name: subredditName,
                },
            }
        } else if (session) {
            whereClause = {
                subreddit: {
                    id: {
                        in: followedCommunutiesIds,
                    }
                }
            }

        }
        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                subreddit: true,
                votes: true,
                author: true,
                comments: true
            }
        })
        return new Response(JSON.stringify(posts))

    } catch (err) {
        if (err instanceof z.ZodError) {
            return new Response("Invalid request data Passed", { status: 422 });
        }
        return new Response("Could not fetch mrore posts", {
            status: 500,
        });

    }
}
