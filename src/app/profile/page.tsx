import { Button } from "@/components/ui/button";
import ChangePassword from "@/components/user/ChangePassword";
import UpdateUser from "@/components/user/UpdateUser";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // console.log("server session", session);

  if (!session) redirect("/auth/login");

  const FULL_POST_ACCESS = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: {
        posts: ["update", "delete"],
      },
    },
  });

  const OWN_POST_ACCESS = await auth.api.userHasPermission({
    headers: await headers(), //checking owen permission
    body: {
      permissions: {
        posts: ["update:own", "delete:own"],
      },
    },
  });

  return (
    <div className="flex flex-col p-4 w-full">
      <div className="flex items-center gap-2">
        <span
          data-role={session.user.role}
          className="size-4 rounded-full animate-ping data-[role=USER]:bg-blue-600 data-[role=ADMIN]:bg-red-600 duration-1000"
        />
        <h1 className="font-bold text-3xl">Server Profile</h1>
      </div>

      {/* image*/}
      <div className="my-5 w-20 h-20 rounded flex items-center justify-center shadow-2xl shadow-slate-500">
        {session.user.image ? (
          <Image
            src={session.user.image}
            width={80}
            height={80}
            alt={session.user.name}
          />
        ) : (
          <p className="text-3xl font-bold uppercase">
            {session.user.name.slice(0, 2)}
          </p>
        )}
      </div>

      {/* update user*/}
      <div className="flex flex-col gap-8">
        <UpdateUser image={session.user.image ?? ""} name={session.user.name} />
        <ChangePassword />
      </div>

      <pre className="text-sm overflow-clip">
        {JSON.stringify(session, null, 2)}
      </pre>

      <h3 className="text-3xl font-bold">Permissions</h3>
      <div className="flex items-center gap-4">
        <Button size="sm" disabled={!OWN_POST_ACCESS.success}>
          Manage Own Posts
        </Button>
        <Button
          className="w-fit"
          size="sm"
          disabled={!FULL_POST_ACCESS.success}
        >
          Manage All Posts
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
