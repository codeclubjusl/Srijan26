"use server";

import { User } from "@/types/types";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/client";
import { auth, signIn, unstable_update } from "@/auth";
import { redirect } from "next/navigation";
import { CONST } from "@/utils/constants";
import { AuthError } from "next-auth";

const getUserByEmail = async (email: string | null) => {
  if (!email) return null;
  const user = await prisma.user.findFirst({ where: { email } });
  return user;
};

const validateUser = async (user: User | null, password: string) => {
  if (!user || !user.password) return false;

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) return false;
  return true;
};

const handleSignin = async (email: string, password: string) => {
  if(!email || !password) return {ok: false, message: "Email and password required"};
  try{
    await signIn("credentials",{
      email,
      password,
      redirect: false
    });
    return {ok: true, message: "Signed in successfully"};
  }catch(err){
    console.error(err);
    if(err instanceof AuthError && err.type === "CredentialsSignin")
      return {ok: false, message: "Invalid credentials"};
    else
      return {ok: false, message: "Error in sign in"};
  }
}

const verifyCaptchaToken = async (token: string | null) => {
  if (!token) return { ok: false, message: "Captcha Verification Failed" };

  const captchaBody = new URLSearchParams([
    ["secret", CONST.hcaptcha.SECRET || ""],
    ["response", token],
    ["sitekey", CONST.hcaptcha.SITEKEY || ""],
  ]);

  const captchaResponse = await fetch(CONST.hcaptcha.VERIFICATION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: captchaBody.toString(),
  });

  const captchaStatus = await captchaResponse.json();
  return captchaStatus.success;
};

const signup = async (user: User, hCaptchaToken: string | null) => {
  try {
    const validCaptcha = await verifyCaptchaToken(hCaptchaToken);
    if (!validCaptcha)
      return { ok: false, message: "Captcha Verification Failed" };

    if (!user.password) return { ok: false, message: "Password is required" };

    const existingUser = await getUserByEmail(user.email);
    if (existingUser) return { ok: false, message: "Email already in use" };

    const password = user.password;
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;

    const createdUser = await prisma.user.create({ data: user });

    if (!createdUser) return {ok: false, message: "Error in signup"};
    
    await signIn("credentials", {
      email: user.email,
      password: password,
      redirect: false
    });
  
    return { ok: true, message: "Signup successful" };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "Error in signup" };
  }
};

const checkAuthentication = async (redirectUrl = "") => {
  const session = await auth();
  if (!session || !session.user || !session.user.id)
    redirect(`/signin?redirect=${redirectUrl}`);

  if(redirectUrl.indexOf("dashboard") === -1 && (!session.user.emailVerified || !session.user.registrationComplete))
    redirect(`/dashboard?redirect=${redirectUrl}`);

  return session.user;
};

const checkAdminAuthorization = async () => {
  const session = await auth();
  if (
    !session ||
    !session.user ||
    !session.user.id ||
    session.user.role !== "ADMIN"
  )
    redirect("/signin");

  return session.user;
};

const checkRegistrationStatus = async (id: string | undefined) => {
  if (!id) return { emailVerified: null, registrationComplete: false };
  const user = await prisma.user.findFirst({
    where: { id },
    select: { emailVerified: true, registrationComplete: true },
  });
  if (!user) return { emailVerified: null, registrationComplete: false };
  return user;
};

const updateVerification = async () => {
  const res = await unstable_update({ user: { emailVerified: new Date() } });
  return res;
};

const updateRegistrationStatus = async () => {
  const res = await unstable_update({ user: { registrationComplete: true } });
  return res;
};

export {
  getUserByEmail,
  validateUser,
  handleSignin,
  signup,
  checkAuthentication,
  checkAdminAuthorization,
  checkRegistrationStatus,
  updateVerification,
  updateRegistrationStatus,
};
