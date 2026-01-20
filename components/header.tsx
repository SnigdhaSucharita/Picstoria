"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { authService } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup") || pathname?.startsWith("/forgot-password") || pathname?.startsWith("/reset-password");

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Logged out successfully",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="transition-transform hover:scale-105">
          <Logo size="sm" />
        </Link>

        <nav className="flex items-center space-x-4">
          {!isAuthPage && (
            <>
              <Link href="/collection">
                <Button variant="ghost">Collection</Button>
              </Link>
              <Link href="/history">
                <Button variant="ghost">History</Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
