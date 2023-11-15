import { db } from "@/lib/db"
import { tr } from "date-fns/locale";

export async function GET(req: Request) {
    const url = new URL(req.url)
    const q = url.searchParams.get('q')



    if (!q) {
        return new Response('Invalid query', { status: 400 })
    }

    const result = await db.subreddit.findMany({
        where: {
            name: {
                startsWith: q,
            },
        },
        include: { 
            _count: true
        },
        take: 5,
    })

    return new Response(JSON.stringify(result))
}