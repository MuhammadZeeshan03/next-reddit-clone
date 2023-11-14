'use client'

import { FC, useState, useEffect } from 'react'
import { VoteType } from '@prisma/client'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { usePrevious } from '@mantine/hooks'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button';
import { useMutation } from '@tanstack/react-query';
import { PostVoteRequest } from '@/lib/validators/vote'
import axios from 'axios'

interface PostVoteClientProps {
  postId: string,
  initialVote?: VoteType | null
  initialVotesAmt: number,
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  postId,
  initialVotesAmt,
  initialVote,
}) => {

  const { loginToast } = useCustomToast()
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)


  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const { } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      }
      await axios.patch('/api/subreddit/post/vote', payload)
    }
  })




  return (

    <div className='flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
      <Button size='sm' variant='ghost' aria-label='upvote'>
        <ArrowBigUp className={cn('h-5 w-5 text-zinc-700', {
          'text-emrald-500 fill-emerald-500': currentVote === 'upvote'
        })} />
      </Button>

      <p className='text-center py-2 font-medium text-sm text-zinc-900'>
        {votesAmt}
      </p>

      <Button size='sm' variant='ghost' aria-label='downvote'>
        <ArrowBigDown className={cn('h-5 w-5 text-zinc-700', {
          'text-red-500 fill-red-500': currentVote === 'downvote'
        })} />
      </Button>

    </div>
  )
}

export default PostVoteClient