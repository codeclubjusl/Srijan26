"use client";

import Balls from "@/components/Balls";
import { Clickable } from "@/components/Clickable";
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
    handleForgotPassword(email)
    .then(() => {
      toast("Please check your email for further instructions");
      setTimeout(
        () => {
          setLoading(false);
        },
        1000 * 60 * 2,
      );
    }).catch(() => {
      toast.error("Error occurred. Please try again later.")
    })
  };
  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full min-h-[80vh]">
      <Balls />
      <h1 className="text-5xl font-semibold font-elnath text-yellow text-center">Forgot Password</h1>
      <p>
        If the email is registered, you will receive an email containing a link
        to a password reset page.
      </p>
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-5 py-3 border border-yellow/70 rounded-full outline-none w-full sm:w-1/3 2xl:w-1/4"
        placeholder="Email Address"
      />
      <div className="relative">
        <Clickable
          as="button"
          className="bg-red hover:bg-red/70 active:bg-red/40"
          onClick={() => handleSubmit()}
          disabled={loading}
        >
          Send Email
        </Clickable>
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
