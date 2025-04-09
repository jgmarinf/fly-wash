import { Geist, Geist_Mono, Tektur } from "next/font/google";



export const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
  });
  
export const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
  });

  export const tektur = Tektur({
    subsets: ["latin"],
    variable: "--font-tektur",
  });
