"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteUser } from "@/server/backend/mutations/userMutations";

import { Loader2Icon, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { User } from "@/server/db/schema/user";
import UserRoleSelect from "./UserRoleSelect";

interface Props {
  users: User[];
}

const AllUsers = ({ users }: Props) => {
  const { mutate: deleteUser } = useDeleteUser();
  const { data: session } = useSession();

  if (!session || !session.user) redirect("/auth/login");
  const currentUser = session?.user;

  return (
    <div className="w-full">
      {users?.length === 0 ? (
        <div className="flex w-full items-center justify-center">
          <Loader2Icon className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="w-full">
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <UserRoleSelect userId={user.id} role={user.role} />
                </TableCell>
                <TableCell>
                  <Button
                    disabled={
                      user.role === "ADMIN" || currentUser?.id === user.id
                    }
                    variant="ghost"
                    className="bg-red-200 cursor-pointer hover:bg-red-200 disabled:bg-slate-300"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Trash2Icon className="w-5 h-5 text-red-700" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AllUsers;
