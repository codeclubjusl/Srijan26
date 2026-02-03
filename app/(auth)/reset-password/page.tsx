"use client";
import Loading from "@/components/Loading";
import Tooltip from "@/components/Tooltip";
import {
  resetPassword,
  verifyPasswordResetToken,
} from "@/services/UserService";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import z from "zod";

function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPassword />
    </Suspense>
  );
}

const PasswordResetSchema = z
  .object({
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

function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    verifyPasswordResetToken(token)
      .then((res) => {
        if (res.ok && res.id) setUserId(res.id);
        else router.push("/404");
      })
      .catch(() => {
        router.push("/404");
      });
  }, [token, router]);

  const handleChange = (field: string, value: string) => {
    setData((oldData) => ({ ...oldData, [field]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setErrors({password: "", confirmPassword: ""});
    const isValid = PasswordResetSchema.safeParse(data);
    if (!isValid.success) {
      isValid.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          setErrors((oldErrors) => ({
            ...oldErrors,
            [issue.path[0]]: issue.message,
          }));
        }
      });
      setLoading(false);
      return;
    }
    toast("Submitting...");

    resetPassword(userId, data.password, token)
    .then((res) => {
      if(res.ok) toast.success(res.message);
      else toast.error(res.message);
    });

    setLoading(false);
  };

  return (
    <div className="font-jetbrains-mono flex flex-col items-center gap-8 p-12">
      <h1 className="text-4xl font-semibold">Reset your Password</h1>
      <div className="relative flex flex-col items-center gap-2">
        <div className="absolute top-1/2 -right-10 -translate-y-1/2">
          <Tooltip message="Password must be atleast 8 characters long and must contain atleast 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character">
            <p className="rounded-full bg-gray-300/40 px-2 py-1 text-xs">i</p>
          </Tooltip>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => handleChange("password", e.target.value)}
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
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          className="rounded-sm border px-2 py-1"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>
      <button
        className="rounded-xs bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
        onClick={() => handleSubmit()} disabled={loading}
      >
        Update Password
      </button>
    </div>
  );
}

export default Page;
