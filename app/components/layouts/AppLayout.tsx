import React from "react";
import { Link } from "react-router";
import { Button } from "../Button";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  backTo?: string;
  className?: string;
}

export function AppLayout({
  children,
  title,
  showBackButton = false,
  backTo = "/",
  className = "min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4",
}: AppLayoutProps) {
  return (
    <div className={className}>
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          {showBackButton && (
            <Link to={backTo}>
              <Button onClick={() => {}} variant="secondary">
                ← Volver
              </Button>
            </Link>
          )}
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
