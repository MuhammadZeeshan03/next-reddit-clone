import { User } from "next-auth";
import React, { FC } from "react";
import Image from "next/image";

import { Avatar, AvatarFallback } from "./Avatar";
import { Icons } from "./Icons";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            alt="Profile picture"
            src={user.image}
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <Icons.user className="h-4 w-4"></Icons.user>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
