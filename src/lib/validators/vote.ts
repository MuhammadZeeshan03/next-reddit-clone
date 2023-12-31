import { z } from 'zod'


export const PostVoteValidator = z.object({
    postId: z.string(),
    voteType: z.enum(['upvote', 'downvote'])

})

export type PostVoteRequest = z.infer<typeof PostVoteValidator>


export const CommmentVoteValidator = z.object({
    commentId: z.string(),
    voteType: z.enum(['upvote', 'downvote'])

})

export type CommentVoteRequest = z.infer<typeof CommmentVoteValidator>
