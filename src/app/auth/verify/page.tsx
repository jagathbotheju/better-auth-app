import NewToken from "@/components/auth/NewToken";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ error: string }>;
}

const EmailVerifyPage = async ({ searchParams }: Props) => {
  const error = (await searchParams).error;
  if (!error) redirect("/profile");

  return (
    <div className="flex flex-col p-4 w-full gap-6">
      <h1 className="font-bold text-3xl">Login Error</h1>

      <p className="text-destructive uppercase">
        {error === "invalid_token" || error === "token_expired"
          ? "Token error, please request a new Token"
          : "Unknown Error"}
      </p>

      <div className="mt-6">
        <NewToken />
      </div>

      <Button asChild className="w-fit">
        <Link href="/">Home</Link>
      </Button>
    </div>
  );
};

export default EmailVerifyPage;
