import "./globals.css";
import Provider from "../components/Provider";

export const metadata = {
  title: "3D Bharat",
  description: "Investor & Corporate Dashboard",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}