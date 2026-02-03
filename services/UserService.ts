"use server";
import { prisma } from "@/prisma/client";
import { getUserByEmail } from "./AuthService";
import ShortUniqueId from "short-unique-id";
import { sendPasswordResetEmail, sendVerificationEmail } from "./EmailService";
import bcrypt from "bcryptjs";
import { SERVER_URL } from "@/utils/constants";

type RegistrationData = {
  phone: string;
  college: string;
  year: string;
  department: string;
};

const completeUserRegistration = async (data: RegistrationData, id: string) => {
  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        phone: data.phone,
        year: data.year,
        college: data.college,
        department: data.department,
        registrationComplete: true,
        emailVerified: new Date(),
      },
    });
    return { ok: true, message: "Registration completed" };
  } catch (err) {
    console.error(`Error in completing user registration: ${err}`);
    return { ok: false, message: "Error occurred" };
  }
};

const matchVerificationCode = async (email: string, code: string) => {
  try {
    const userToken = await prisma.user.findFirst({
      where: { email },
      select: { verificationToken: true },
    });
    const match = userToken?.verificationToken === code;

    const verifiedAt = new Date();
    if (match)
      await prisma.user.update({
        where: { email },
        data: { emailVerified: verifiedAt },
      });
    return match;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const verifyEmail = async (email: string) => {
  try {
    const token = new ShortUniqueId({ length: 8 }).rnd();
    await prisma.user.update({
      where: { email },
      data: { verificationToken: token },
    });

    const result = await sendVerificationEmail(email, token);
    if (result)
      return { ok: true, message: "Email sent with verification code" };
    else return { ok: false, message: "Error in email verification" };
  } catch (err) {
    console.error(`Error in email verification: ${err}`);
    return { ok: false, message: "Error in email verification" };
  }
};

const handleForgotPassword = async (email: string) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) return false;

    const token = new ShortUniqueId({ length: 20 }).rnd();
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.resetPasswordToken.create({
      data: {
        user_id: existingUser.id,
        token,
        expiresAt: tokenExpiry,
      },
    });
    const link = `${SERVER_URL}/reset-password?token=${token}`;

    const res = await sendPasswordResetEmail(email, link);

    return res;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const verifyPasswordResetToken = async (token: string | null) => {
  try{
    if (!token) return { ok: false, id: null };
    const resetToken = await prisma.resetPasswordToken.findFirst({
      where: { token },
    });
    
    const currentDate = new Date();
    if (!resetToken || !resetToken.user_id) return { ok: false, id: null };
    const tokenValid = resetToken?.expiresAt > currentDate;
    if (!tokenValid){
      await prisma.resetPasswordToken.delete({where: {token}});
      return { ok: false, id: null };
    }
    
    return { ok: true, id: resetToken.user_id };
  }catch(err){
    console.error(`Error while verifying password reset token: ${err}`);
    return { ok: false, id: null};
  }
};

const resetPassword = async (userId: string, password: string, token: string | null) => {
  try{
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    if(token) await prisma.resetPasswordToken.delete({where: {token}});
    
    return { ok: true, message: "Password reset successfully" };
  }catch(err){
    console.error(`Error while resetting password: ${err}`);
    return {ok: false, message: "Error occurred"};
  }
};

export {
  completeUserRegistration,
  matchVerificationCode,
  verifyEmail,
  handleForgotPassword,
  verifyPasswordResetToken,
  resetPassword,
};
