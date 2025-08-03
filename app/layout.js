import Footer from "./_components/Footer";
import Navigation from "./_components/Navigation";
import { auth } from "./_lib/auth";
import "./globals.css";
import Providers from "./providers";
import { I18nProvider } from "./contexts/I18nContext";

export const metadata = {
  title: "Healthwise",
  description: "AI-powered symptom checker and diagnostic platform",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <Providers>
            <Navigation session={session} />
            {children}
            <Footer />
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
