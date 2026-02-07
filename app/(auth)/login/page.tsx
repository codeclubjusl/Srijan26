"use client";
import Balls from "@/components/Balls";
import { Clickable } from "@/components/Clickable";
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
        }).finally(() => {
            setLoading(false);
        })
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
        <div className="flex flex-col items-center justify-center gap-8 h-full min-h-[80vh]">
            <Balls />
            <h1 className="text-5xl font-semibold font-elnath text-yellow">
                Login
            </h1>
            <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={data.email}
                onChange={(e) => handleUpdate(e.target.value, "email")}
                className="px-5 py-3 border border-yellow/70 rounded-full outline-none w-full sm:w-1/3 2xl:w-1/4"
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => handleUpdate(e.target.value, "password")}
                className="px-5 py-3 border border-yellow/70 rounded-full outline-none w-full sm:w-1/3 2xl:w-1/4"
            />
            <Clickable
                as="button"
                onClick={(e) => handleSubmit(e)}
                disabled={loading}
                className="bg-red hover:bg-red/70 active:bg-red/40"
            >
                Submit
            </Clickable>
            <div className="flex w-full sm:w-2/5 items-center justify-between gap-6">
                <div className="h-px w-full bg-linear-to-r from-red to-orange"></div>
                <p>OR</p>
                <div className="h-px w-full bg-linear-to-l from-red to-orange"></div>
            </div>
            <button
                onClick={(e) => handleSignInWithGoogle(e)}
                className="rounded-full bg-white px-8 py-3 text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60 flex items-center gap-3"
                disabled={loading}
            >
                <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    style={{display: "block"}} height={24} width={24}
                >
                    <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                <span>Sign in with Google</span>
            </button>
            <div className="flex justify-between gap-x-8">
                <p>Don&apos;t have an account?</p>
                <Link
                    href={"/signup"}
                    className="underline underline-offset-4 text-yellow"
                >
                    Sign Up
                </Link>
            </div>
            <Link
                href={"/forgot-password"}
                className="text-yellow underline underline-offset-4"
            >
                Forgot Password
            </Link>
        </div>
    );
}

export default Page;
