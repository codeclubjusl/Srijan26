"use client";

import { matchVerificationCode, verifyEmail } from "@/services/UserService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { User } from "@/types/types";
import { updateVerification } from "@/services/AuthService";
import toast from "react-hot-toast";

function VerifyEmail({ user }: { user: User }) {
  const email = user.email;
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (code.length !== 8) {
      toast.error("Invalid code");
      return;
    }
    toast.loading("Verifying code...");
    matchVerificationCode(email, code)
      .then((res) => {
        toast.dismiss();
        if (res) updateVerification().then(() => router.refresh());
        else toast.error("Invalid Code");
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Error occurred while verifying code")
      });
  };

  const handleSendCode = () => {
    setCodeSent(true);
    toast.loading("Sending email...");
    verifyEmail(email)
      .then((res) => {
        toast.dismiss();
        if (res.ok) toast.success(res.message);
        else toast.error(res.message);
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Error occured");
      });
  };

  return (
    <div className="font-jetbrains-mono flex flex-col items-center gap-8 p-12">
      <h1 className="text-5xl font-semibold">Verify your email</h1>
      <p>An email will be sent to your registered email address with a code.</p>
      <button
        className="rounded-xs bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
        onClick={() => handleSendCode()}
        disabled={codeSent}
      >
        Send Email
      </button>
      <input
        type="text"
        name="code"
        placeholder="Enter Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="rounded-sm border px-2 py-1"
      />
      <button
        className="rounded-xs bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
        onClick={() => handleSubmit()}
      >
        Verify Code
      </button>
    </div>
  );
}

export default VerifyEmail;
