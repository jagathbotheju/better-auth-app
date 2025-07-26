import { Button } from "@/components/ui/button";
import AllUsers from "@/components/user/AllUsers";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/user";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/auth/login");

  const { users } = await auth.api.listUsers({
    headers: await headers(),
    query: {
      sortBy: "name",
    },
  });

  return (
    <div className="flex w-full">
      {session && session.user.role !== "ADMIN" ? (
        <div className="p-10 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-muted-foreground">
            No Authorized!
          </h1>
          <Button asChild className="w-fit">
            <Link href="/">Home</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col p-4 w-full">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <div className="flex flex-col gap-2 mt-8 w-full">
            <h3 className="text-xl font-semibold">Users</h3>
            <AllUsers users={users as User[]} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
