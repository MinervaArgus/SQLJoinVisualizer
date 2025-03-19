import "./globals.css";

export const metadata = {
  title: "SQL Joins Visualizer",
  description: "Interactive tool to understand SQL joins with visual representations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
