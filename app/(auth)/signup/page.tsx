"use client";
import { signup } from "@/services/AuthService";
import { HCaptchaProvider, useHCaptcha } from "@hcaptcha/react-hcaptcha/hooks";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { CONST } from "@/utils/constants";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import z from "zod";
import Tooltip from "@/components/Tooltip";

function Page() {
  return (
    <HCaptchaProvider sitekey={CONST.hcaptcha.SITEKEY} size="invisible">
      <SignUpForm />
    </HCaptchaProvider>
  );
}

const UserSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email"),
    password: z
      .string()
      .regex(
        RegExp("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"),
        "Weak Password",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function SignUpForm() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>();
  const { executeInstance } = useHCaptcha();
  const router = useRouter();

  const handleUpdate = (value: string, field: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({name: "", email: "", password: "", confirmPassword: ""});
    const isValid = UserSchema.safeParse(data);
    if (!isValid.success) {
      isValid.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          setErrors((oldErrors) => ({
            ...oldErrors,
            [issue.path[0]]: issue.message,
          }));
        }
      });
      return;
    }

    toast.loading("Submitting...");
    setLoading(true);

    executeInstance()
      .then((hCaptchaToken) => {
        return signup(
          {
            name: data.name,
            email: data.email,
            password: data.password,
            registrationComplete: false,
            emailVerified: null,
            image: null,
          },
          hCaptchaToken ?? null,
        );
      })
      .then((res) => {
        toast.dismiss();
        if (res.ok) {
          toast.success("Signed up successfully");
          router.push("/dashboard");
        } else {
          toast.error(res.message);
        }
      })
      .catch(() => {
        toast.dismiss();
        toast("Error occurred");
        setLoading(false);
      });
  };

  const handleSignInWithGoogle = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    signIn("google", {
      redirectTo: "/dashboard",
    }).catch(() => {
      toast("Error occurred");
      setLoading(false);
    });
  };

  return (
    <div className="font-jetbrains-mono flex flex-col items-center gap-8 p-12">
      <h1 className="my-8 text-4xl font-semibold">Sign Up</h1>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={data.name}
            onChange={(e) => handleUpdate(e.target.value, "name")}
            className="rounded-sm border px-2 py-1"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div className="flex flex-col items-center gap-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) => handleUpdate(e.target.value, "email")}
            className="rounded-sm border px-2 py-1"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div className="flex flex-col items-center gap-2 relative">
          <div className="absolute -right-10 top-1/2 -translate-y-1/2">
          <Tooltip message="Password must be atleast 8 characters long and must contain atleast 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character">
            <p className="text-xs py-1 px-2 rounded-full bg-gray-300/40">i</p>
          </Tooltip>
          </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) => handleUpdate(e.target.value, "password")}
              className="rounded-sm border px-2 py-1"
            />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={data.confirmPassword}
            onChange={(e) => handleUpdate(e.target.value, "confirmPassword")}
            className="rounded-sm border px-2 py-1"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
        <button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          className="rounded-xs bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
          disabled={loading}
        >
          Sign Up
        </button>
      </div>
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
        <p>Already have an account?</p>
        <Link href={"/signin"} className="underline underline-offset-4">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default Page;
