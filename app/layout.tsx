import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { ConfirmationDialogContextProvider } from "@/hooks/useConfirmationDialog";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
    title: "Srijan 26 | Jadavpur University",
    description:
        "Jadavpur University's Annual Techfest, organised by F.E.T.S.U.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
            >
                <ConfirmationDialogContextProvider>
                    {children}
                </ConfirmationDialogContextProvider>
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            backgroundColor: "#1c1c1c",
                            color: "white",
                            padding: "12px",
                            borderRadius: "6px",
                            minWidth: "300px",
                            textAlign: "left",
                            fontFamily: "JetBrains Mono",
                        },
                        success: {
                            iconTheme: {
                                primary: "#48ab60",
                                secondary: "white",
                            },
                        },
                    }}
                    containerStyle={{
                        right: 30,
                        bottom: 20,
                    }}
                />
            </body>
        </html>
    );
}
