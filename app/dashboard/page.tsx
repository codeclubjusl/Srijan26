import CompleteRegistration from "@/components/Dashboard/CompleteRegistration";
import Dashboard from "@/components/Dashboard/Dashboard";
import VerifyEmail from "@/components/Dashboard/VerifyEmail";
import { checkAuthentication } from "@/services/AuthService";
import { SessionProvider } from "next-auth/react";
import React from "react";

async function Page() {
  const user = await checkAuthentication("/dashboard");

  if (!user.emailVerified)
    return (
      <SessionProvider>
        <VerifyEmail user={user} />
      </SessionProvider>
    );
  if (!user.registrationComplete) return <CompleteRegistration id={user.id} />;
  return <Dashboard />;
}

export default Page;
