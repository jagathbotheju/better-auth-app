"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { admin } from "@/lib/auth-client";
import { roleEnum } from "@/server/db/schema/user";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  userId: string;
  role: string;
}

const UserRoleSelect = ({ userId, role }: Props) => {
  const [value, setValue] = useState(role);
  const [loading, setLoading] = useState(false);

  console.log("roleEnum", roleEnum.enumValues[0]);

  const setUserRole = async (role: string) => {
    const userRole =
      role === "USER" ? roleEnum.enumValues[0] : roleEnum.enumValues[1];

    const canChangeRole = await admin.hasPermission({
      permission: {
        user: ["set-role"],
      },
    });

    if (canChangeRole.error) {
      return toast.error("Forbidden");
    }

    await admin.setRole({
      userId,
      role: userRole,
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("User role updated");
        },
      },
    });
  };

  return (
    <Select
      onValueChange={(role) => {
        setValue(role);
        setUserRole(role);
      }}
      value={value}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select user Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={roleEnum.enumValues[1]}>ADMIN</SelectItem>
          <SelectItem value={roleEnum.enumValues[0]}>USER</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default UserRoleSelect;
