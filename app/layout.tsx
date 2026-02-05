import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConfirmationDialogContextProvider } from "@/hooks/useConfirmationDialog";
import { MobileNavProvider } from "@/hooks/useMobileNav";
import NavBar from "@/components/NavBar";
import { Toaster } from "react-hot-toast";

const euclid = localFont({
    variable: "--font-euclid",
    src: "../public/fonts/Euclid-Circular-B.woff2",
    display: "swap",
    preload: true,
});

const elnath = localFont({
    variable: "--font-elnath",
    src: "../public/fonts/ELNATH.woff2",
    display: "swap",
    preload: true,
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
                className={`${euclid.variable} ${elnath.variable} antialiased`}
            >
                <MobileNavProvider>
                    <ConfirmationDialogContextProvider>
                        <NavBar />
                        {children}
                    </ConfirmationDialogContextProvider>
                </MobileNavProvider>
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
