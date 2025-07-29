import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ error: string }>;
}

const LoginErrorPage = async ({ searchParams }: Props) => {
  const sp = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <h1 className="font-bold text-3xl">Login Error</h1>

      <p className="text-destructive">
        {sp.error === "account_not_linked"
          ? "This Account already linked to another signIn method"
          : "Unknown Error"}
      </p>

      <Button asChild>
        <Link href="/">Home</Link>
      </Button>
    </div>
  );
};

export default LoginErrorPage;
