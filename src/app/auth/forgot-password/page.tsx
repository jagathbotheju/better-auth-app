import ForgetPassword from "@/components/auth/ForgetPassword";

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col p-4 w-full gap-6">
      <h1 className="font-bold text-3xl">Forget Password</h1>

      <div className="mt-6">
        <ForgetPassword />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
