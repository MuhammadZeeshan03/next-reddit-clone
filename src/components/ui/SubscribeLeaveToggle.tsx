"use client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./Button";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import { FC, startTransition } from "react";
import { AxiosError } from "axios";
import axios from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
interface SubscribeLeaveToggleProps {
  subredditId: string;
  isSubscribed: boolean;
  subredditName: string;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subredditId,
  isSubscribed,
  subredditName
}) => {

  const { loginToast } = useCustomToast();
  const router = useRouter();


  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: 'There was a problem',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    },

    onSuccess: () => {
      startTransition(() => {
        router.refresh()

      })

      return toast({
        title: 'Subscribed',
        description: `You have subscribed to this r/${subredditName}`,
        variant: 'default'
      })
    }
  });


  const { mutate: unsubscribe, isLoading: isUnSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: 'There was a problem',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    },

    onSuccess: () => {
      startTransition(() => {
        router.refresh()

      })

      return toast({
        title: 'Unsubscribed',
        description: `You have unsubscribed from r/${subredditName}`,
        variant: 'default'
      })
    }
  });

  return isSubscribed ? (
    <Button onClick={() => { unsubscribe() }}
      isLoading={isUnSubLoading}

      className=" w-full mt-1 mb-4 ">Leave Community</Button>
  ) : (
    <Button isLoading={isSubLoading} onClick={() => { subscribe() }} className=" w-full mt-1 mb-4 ">join to a Post</Button>
  );
};

export default SubscribeLeaveToggle;
