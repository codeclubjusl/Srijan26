"use client";
import { handleSignin } from "@/services/AuthService";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import toast from "react-hot-toast";
import z from "zod";

function Page() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}

const SigninSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

function SignInForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleUpdate = (value: string, field: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isValid = SigninSchema.safeParse(data);
    if (!isValid.success) {
      toast.error("Invalid credentials");
      setLoading(false);
      return;
    }

    toast("Submitting...");
    handleSignin(data.email, data.password).then((res) => {
      if (!res.ok) toast.error(res.message);
      else redirect(redirectUrl ?? "/dashboard");
    });
    setLoading(false);
  };

  const handleSignInWithGoogle = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    signIn("google", {
      redirectTo: "/dashboard",
    })
      .catch(() => {
        toast("Error occurred");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="font-jetbrains-mono flex flex-col items-center gap-8 p-12">
      <h1 className="my-12 text-4xl font-semibold">Sign In</h1>
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={data.email}
        onChange={(e) => handleUpdate(e.target.value, "email")}
        className="rounded-sm border px-2 py-1"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) => handleUpdate(e.target.value, "password")}
        className="rounded-sm border px-2 py-1"
      />
      <button
        onClick={(e) => handleSubmit(e)}
        disabled={loading}
        className="rounded-xs bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
      >
        Submit
      </button>
      <div className="flex w-2/5 items-center justify-between gap-6">
        <div className="h-px w-full bg-white"></div>
        <p>OR</p>
        <div className="h-px w-full bg-white"></div>
      </div>
      <button
        onClick={(e) => handleSignInWithGoogle(e)}
        className="rounded-xs bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
        disabled={loading}
      >
        Sign in with Google
      </button>
      <div className="flex justify-between gap-x-8 text-sm">
        <p>Don&apos;t have an account?</p>
        <Link href={"/signup"} className="underline underline-offset-4">
          Sign Up
        </Link>
      </div>
      <Link
        href={"/forgot-password"}
        className="text-sm underline underline-offset-4"
      >
        Forgot Password
      </Link>
    </div>
  );
}

export default Page;
