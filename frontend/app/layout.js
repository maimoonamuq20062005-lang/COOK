import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RecipeProvider } from "@/context/RecipeContext";
import { ToastProvider } from "@/context/ToastContext";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "SmartMeal — Cook Like a Pro with What You Have",
  description:
    "Discover incredible recipes using ingredients already in your kitchen. SmartMeal matches what you have to real recipes, compares nutrition, and helps you cook with confidence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-white text-[var(--color-foreground)] font-[var(--font-body)]">
        <ToastProvider>
          <RecipeProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </RecipeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
