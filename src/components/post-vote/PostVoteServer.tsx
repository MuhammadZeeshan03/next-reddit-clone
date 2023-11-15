import { Vote, VoteType, Post } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React, { FC } from 'react'
import PostVoteClient from './PostVoteClient'

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)) 

interface PostVoteServerProps {
    postId: string,
    initialVotesAmt?: number,
    initialVote?: VoteType | null,
    getData?: () => Promise<(Post & { votes: Vote[] }) | null>,
}

const PostVoteServer = async (
    { postId,
        initialVotesAmt,
        initialVote,
        getData, }
        : PostVoteServerProps
) => {

    const session = await getServerSession()

    let _votesAmt: number = 0
    let _currentVote: VoteType | null | undefined = undefined

    if (getData) {
        const post = await getData()
        if (!post) return notFound()

        _votesAmt = post.votes.reduce((acc, vote) => {
            if (vote.type === 'upvote') return acc + 1
            if (vote.type === 'downvote') return acc - 1
              return acc

        }, 0)

        _currentVote = post.votes.find(vote => vote.userId === session?.user.id)?.type ?? null

    } else {
        _votesAmt = initialVotesAmt!
        _currentVote = initialVote
    }

    return (
        <PostVoteClient
        postId={postId}
        initialVotesAmt={_votesAmt}
        initialVote={_currentVote}
        />
    )
}

export default PostVoteServer