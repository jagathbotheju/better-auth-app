"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUser } from "@/lib/auth-client";
import { Button } from "../ui/button";

interface Props {
  image: string;
  name: string;
}

const UpdateUser = ({ image, name }: Props) => {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const name = String(formData.get("name"));
    const image = String(formData.get("image"));

    if (!name && !image) {
      return toast.error("Please enter name or image");
    }

    await updateUser({
      ...(name && { name }),
      image,
      fetchOptions: {
        onRequest: () => {
          setPending(true);
        },
        onResponse: () => {
          setPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("User updated successfully");
          router.refresh();
        },
      },
    });
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <h3 className="text-xl font-bold">Update User</h3>

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={name} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="image">Image</Label>
        <Input type="url" id="image" name="image" defaultValue={image} />
      </div>

      <Button className="w-fit" type="submit">
        Update
      </Button>
    </form>
  );
};

export default UpdateUser;
