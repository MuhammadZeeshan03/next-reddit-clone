'use client'
import React, { useCallback, useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './Command'
import { useQuery } from '@tanstack/react-query'
import { set } from 'date-fns'
import axios from 'axios'
import { Prisma, Subreddit } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Users, UsersIcon } from 'lucide-react'
import { request } from 'http'
import debounce from 'lodash.debounce'


function SearchBar() {

  const [input, setInput] = useState<string>('')

  const router = useRouter()
  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching } = useQuery({

      queryFn: async () => {
        if (!input) return []
        const { data } = await axios.get(`/api/search?q=${input}`)
        return data as (Subreddit & {
          _count: Prisma.SubredditCountOutputType
        })[]
      },
      queryKey: ['search-query']
      , enabled: false
    })
  const request = debounce(
    () => {
      refetch()
    }
  )

  const debounceRequest = useCallback(() => {
    request()

  }, [])

  return (


    <Command className='relative rounded-lg border max-w-lg z-50 overflow-visible' >
      <CommandInput
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        placeholder='Seach Communities...'
        className='outline-none border-none focus:border-none ring-0' isLoading={false} />


      {input.length > 0 ? (
        <CommandList className='absolute bg-white top-full inset-x-0 shadow rounded-b-md'>
          {isFetched && <CommandEmpty>
            No Results found
          </CommandEmpty>}

          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading='communities'>
              {queryResults?.map((subreddit) =>
              (
                <CommandItem
                  key={subreddit.id}
                  value={subreddit.name}
                  onSelect={(e) => {
                    router.push(`/r/${e}`)
                    router.refresh()
                  }}
                >
                  <Users className='mr-2 h-4 w-4' />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>

  )
}

export default SearchBar