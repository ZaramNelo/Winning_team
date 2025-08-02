import Navigation from "./_components/Navigation";
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Healthwise",
  description: "AI-powered symptom checker and diagnostic platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
