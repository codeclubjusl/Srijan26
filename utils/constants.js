export const SERVER_URL = process.env.SERVER_URL ?? "http://localhost:3000";

export const CONST = {
    hcaptcha: {
        SITEKEY: process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY,
        SECRET: process.env.HCAPTCHA_SECRET,
        VERIFICATION_URL: "https://api.hcaptcha.com/siteverify"
    },
    email: {
        USER: process.env.SMTP_USER,
        PASS: process.env.SMTP_PASS
    }
};