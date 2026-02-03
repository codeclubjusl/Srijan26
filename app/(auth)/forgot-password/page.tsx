"use client";

import Tooltip from "@/components/Tooltip";
import { handleForgotPassword } from "@/services/UserService";
import React, { useState } from "react";
import toast from "react-hot-toast";
import z from "zod";

function Page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    const emailSchema = z.email();
    const isValid = emailSchema.safeParse(email);
    if (!isValid.success) {
      toast.error("Invalid Email");
      setLoading(false);
      return;
    }
    handleForgotPassword(email).then(() => {
      toast("Please check your email for further instructions");
      setTimeout(
        () => {
          setLoading(false);
        },
        1000 * 60 * 2,
      );
    });
  };
  return (
    <div className="font-jetbrains-mono flex flex-col items-center gap-8 p-12">
      <h1 className="text-5xl font-semibold">Forgot Password</h1>
      <p>
        If the email is registered, you will receive an email containing a link
        to a password reset page.
      </p>
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-sm border px-2 py-1"
        placeholder="Email Address"
      />
      <div className="relative">
        <button
          className="rounded-xs bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
          onClick={() => handleSubmit()}
          disabled={loading}
        >
          Send Email
        </button>
        {loading && (
          <div className="absolute top-1/2 -right-10 -translate-y-1/2">
            <Tooltip message="Please wait for 2 minutes before sending another email">
              <p className="rounded-full bg-gray-300/40 px-2 py-1 text-xs">i</p>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
