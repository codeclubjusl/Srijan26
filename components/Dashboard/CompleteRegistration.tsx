"use client";

import { updateRegistrationStatus } from "@/services/AuthService";
import { completeUserRegistration } from "@/services/UserService";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import toast from "react-hot-toast";
import z from "zod";

const RegistrationSchema = z.object({
  phone: z
    .string()
    .min(8, "Invalid phone number")
    .regex(
      RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$"),
      "Invalid phone number",
    ),
  college: z.string().min(1, "College is required"),
  year: z.string().min(1, "Year of Study is required"),
  department: z.string().min(1, "Department is required"),
});

function CompleteRegistration({ id }: { id: string }) {
  return (
    <Suspense>
      <RegistrationForm id={id} />
    </Suspense>
  );
}

function RegistrationForm({ id }: { id: string }) {
  const [data, setData] = useState({
    phone: "",
    college: "",
    year: "",
    department: "",
  });
  const [errors, setErrors] = useState({
    phone: "",
    college: "",
    year: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const handleChange = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setErrors({ phone: "", college: "", department: "", year: "" });
    const isValid = RegistrationSchema.safeParse(data);
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

    toast.loading("Submitting...");
    completeUserRegistration(data, id)
      .then((res) => {
        toast.dismiss();
        if (res.ok) {
          updateRegistrationStatus().then(() => {
            if(redirectUrl) router.push(redirectUrl);
            else router.refresh();
          });
        } else {
          toast.error(res.message);
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Error occurred");
      });

    setLoading(false);
  };

  return (
    <form
      className="font-jetbrains-mono flex flex-col items-center gap-6 p-12"
      onSubmit={(e) => handleSubmit(e)}
    >
      <h1 className="mb-4 text-4xl font-bold">Complete your Registration</h1>
      <div className="flex flex-col items-center gap-2">
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={data.phone}
          onChange={(e) => {
            handleChange("phone", e.target.value);
          }}
          className="rounded-sm border px-2 py-1"
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>
      <div className="flex flex-col items-center gap-2">
        <input
          type="text"
          name="college"
          placeholder="College"
          value={data.college}
          onChange={(e) => {
            handleChange("college", e.target.value);
          }}
          className="rounded-sm border px-2 py-1"
        />
        {errors.college && (
          <p className="text-sm text-red-500">{errors.college}</p>
        )}
      </div>
      <div className="flex flex-col items-center gap-2">
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={data.department}
          onChange={(e) => {
            handleChange("department", e.target.value);
          }}
          className="rounded-sm border px-2 py-1"
        />
        {errors.department && (
          <p className="text-sm text-red-500">{errors.department}</p>
        )}
      </div>
      <div className="flex flex-col items-center gap-2">
        <input
          type="text"
          name="year"
          placeholder="Year"
          value={data.year}
          onChange={(e) => {
            handleChange("year", e.target.value);
          }}
          className="rounded-sm border px-2 py-1"
        />
        {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-xs bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
      >
        Submit
      </button>
    </form>
  );
}

export default CompleteRegistration;
