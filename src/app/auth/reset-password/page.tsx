import ResetPassword from "@/components/auth/ResetPassword";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ token: string }>;
}

const ResetPasswordPage = async ({ searchParams }: Props) => {
  const token = (await searchParams).token;

  if (!token) redirect("/auth/login");

  return (
    <div className="flex flex-col p-4 w-full gap-6">
      <h1 className="font-bold text-3xl">Forget Password</h1>

      <div className="mt-6">
        <ResetPassword token={token} />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
