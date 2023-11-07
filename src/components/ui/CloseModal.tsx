"use client";

import React from "react";
import { Button } from "./Button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

function CloseModal() {
  const router = useRouter();
  return (
    <Button
      variant="subtle"
      className="h-6 w-6 p-0 rounded-md"
      aria-label="close modal"
      onClick={() => router.back()}
    >
      <X className="w-6 h-6 text-slate-9000" />
    </Button>
  );
}

export default CloseModal;
