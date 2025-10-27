'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.jsx or app/page.jsx
import { ClassificationProvider } from './components/context';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./logo.png" />
      </head>
      <body>
        <ClassificationProvider>
          <Provider store={store}>
            {children}
          </Provider>
        </ClassificationProvider>
      </body>
    </html>
  );
}

