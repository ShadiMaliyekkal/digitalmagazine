import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import NavBar from "../components/NavBar";

export const metadata = {
  title: "Jamia Magazine",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <AuthProvider>
          <NavBar />
          <div className="pt-6 px-4">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
