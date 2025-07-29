import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AppProviders } from "@/providers/app-providers";
import StagewiseToolbarInitializer from "@/components/stagewise/stagewise-toolbar-initializer";

export const metadata: Metadata = {
  title: "OneVoice - Professional Video Dubbing Service",
  description: "Transform your videos for global audiences with AI-powered dubbing technology. Professional video dubbing made simple and accessible.",
  keywords: "video dubbing, AI dubbing, voice over, video translation, content localization",
  authors: [{ name: "OneVoice Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black antialiased">
        <AppProviders>
          {process.env.NODE_ENV === "development" && <StagewiseToolbarInitializer />}
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
