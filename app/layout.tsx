/*import { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: "IntelliMeet",
  description: "Smart Video Meeting Platform",
  icons: {
    icon: "/icons/intellimeet-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <ClerkProvider
        appearance={{
          layout: {
            socialButtonsVariant: "iconButton",
            logoPlacement: "inside",
            logoImageUrl: "/icons/intellimeet-logo.png",
            showOptionalFields: false,
            privacyPageUrl: "https://intellimeet.com/privacy",
            termsPageUrl: "https://intellimeet.com/terms",
            socialButtonsPlacement: "bottom",
          },
          variables: {
            colorText: '#fff',
            colorPrimary: '#007AFF',
            colorBackground: '#000000',
            colorInputBackground: '#1C1C1E',
            colorInputText: '#fff',
            colorDanger: '#FF453A',
            colorSuccess: '#34C759',
            colorTextOnPrimaryBackground: '#FFFFFF',
            fontFamily: 'var(--font-jakarta), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            borderRadius: '8px',
            spacingUnit: '16px',
          },
          elements: {
            formButtonPrimary: "bg-[#007AFF] rounded-md hover:shadow-xl text-base font-medium py-3 w-full",
            formButtonReset: "text-[#007AFF] hover:text-blue-400 font-medium",
            card: "bg-[#000000] border-none shadow-2xl px-6 py-6 max-w-md w-full",
            formField: "mb-5",
            formFieldLabel: "text-[15px] text-gray-200 font-medium mb-1.5",
            formFieldInput: "rounded-md border border-[#333333] shadow-sm bg-[#000000] h-12 px-4 text-base mb-2",
            socialButtonsBlockButton: "rounded-md border border-[#333333] bg-[#1A1A1A] hover:bg-[#111111] transition-all duration-200",
            socialButtonsIconButton: "rounded-full border border-[#333333] hover:scale-105 transition-transform w-12 h-12 flex items-center justify-center bg-[#1A1A1A]",
            socialButtonsProviderIcon: "w-5 h-5 text-white",
            footerActionLink: "text-[#007AFF] hover:text-blue-400 font-medium",
            footerActionText: "text-gray-400",
            headerTitle: "text-2xl font-bold mb-1 text-white",
            headerSubtitle: "text-gray-400 text-base",
            dividerLine: "bg-[#333333] h-px",
            dividerText: "text-gray-400 text-sm px-3",
            identityPreviewEditButton: "text-[#007AFF]",
            formFieldAction: "text-[#007AFF] hover:text-blue-400",
            formFieldSuccessText: "text-green-500",
            formFieldErrorText: "text-red-500 text-sm",
            alert: "rounded-md bg-[#1C1C1E] border-0 text-white",
            alertText: "text-white",
            userPreviewMainIdentifier: "text-white font-semibold",
            userPreviewSecondaryIdentifier: "text-gray-400 text-sm",
            userButtonBox: "rounded-full ring-2 ring-white ring-opacity-20"
          }
        }}
      >
        <body className={`${jakarta.className} ${jakarta.variable} bg-dark-1 text-white antialiased`}>
          <Toaster />
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
*/


import { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: "IntelliMeet",
  description: "Smart Video Meeting Platform",
  icons: {
    icon: "/icons/intellimeet-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <ClerkProvider
        appearance={{
          layout: {
            socialButtonsVariant: "iconButton",
            logoPlacement: "inside",
            logoImageUrl: "/icons/intellimeet-logo.png",
            showOptionalFields: false,
            socialButtonsPlacement: "bottom",
          },
          variables: {
            colorText: '#fff',
            colorPrimary: '#007AFF',
            colorBackground: '#000000',
            colorInputBackground: '#1C1C1E',
            colorInputText: '#fff',
            colorDanger: '#FF453A',
            colorSuccess: '#34C759',
            colorTextOnPrimaryBackground: '#FFFFFF',
            fontFamily: 'var(--font-jakarta), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            borderRadius: '8px',
            spacingUnit: '16px',
          },
          elements: {
            formButtonPrimary: "bg-[#007AFF] rounded-md hover:shadow-xl text-base font-medium py-3 w-full",
            formButtonReset: "text-[#007AFF] hover:text-blue-400 font-medium",
            card: "bg-[#000000] border-none shadow-2xl px-6 py-6 max-w-md w-full",
            formField: "mb-5",
            formFieldLabel: "text-[15px] text-gray-200 font-medium mb-1.5",
            formFieldInput: "rounded-md border border-[#333333] shadow-sm bg-[#000000] h-12 px-4 text-base mb-2",
            socialButtonsBlockButton: "rounded-md border border-[#333333] bg-[#1A1A1A] hover:bg-[#111111] transition-all duration-200",
            socialButtonsIconButton: "rounded-full border border-[#333333] hover:scale-105 transition-transform w-12 h-12 flex items-center justify-center bg-[#1A1A1A]",
            socialButtonsProviderIcon: "w-5 h-5 text-white",
            footerActionLink: "text-[#007AFF] hover:text-blue-400 font-medium",
            footerActionText: "text-gray-400",
            headerTitle: "text-2xl font-bold mb-1 text-white",
            headerSubtitle: "text-gray-400 text-base",
            dividerLine: "bg-[#333333] h-px",
            dividerText: "text-gray-400 text-sm px-3",
            identityPreviewEditButton: "text-[#007AFF]",
            formFieldAction: "text-[#007AFF] hover:text-blue-400",
            formFieldSuccessText: "text-green-500",
            formFieldErrorText: "text-red-500 text-sm",
            alert: "rounded-md bg-[#1C1C1E] border-0 text-white",
            alertText: "text-white",
            userPreviewMainIdentifier: "text-white font-semibold",
            userPreviewSecondaryIdentifier: "text-gray-400 text-sm",
            userButtonBox: "rounded-full ring-2 ring-white ring-opacity-20"
          }
        }}
      >
        <body className={`${jakarta.className} ${jakarta.variable} bg-dark-1 text-white antialiased`}>
          <Toaster />
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
