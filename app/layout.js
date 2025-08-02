import Navigation from "./_components/Navigation";
import { auth } from "./_lib/auth";
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Healthwise",
  description: "AI-powered symptom checker and diagnostic platform",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <Providers>
          <Navigation session={session} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
