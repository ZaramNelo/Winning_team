import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Footer from "../_components/Footer";
import Navigation from "../_components/Navigation";
import { auth } from "../_lib/auth";
import "../globals.css";
import Providers from "../providers";

export const metadata = {
  title: "Healthwise",
  description: "AI-powered symptom checker and diagnostic platform",
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const session = await auth();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Navigation session={session} />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
