import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import AuthButton from "./auth/AuthButton";

const Navbar = () => {
  return (
    <div className="flex w-full p-4 justify-between px-10 border border-b-2">
      <Link href="/" className="text-3xl font-bold">
        Better Auth
      </Link>

      <div className="flex items-center gap-4">
        <AuthButton />
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default Navbar;
