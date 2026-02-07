"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

type Status = "loading" | "success" | "expired" | "invalid" | "error";

function VerifyEmail() {
  const params = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  const [status, setStatus] = useState<Status>("loading");
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");

  const BACKEND = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token || !email) {
      setStatus("invalid");
      return;
    }

    const safeToken = token;
    const safeEmail = email;

    async function verify() {
      try {
        await apiClient.get(
          `${BACKEND}/api/auth/verify-email?token=${safeToken}&email=${encodeURIComponent(
            safeEmail,
          )}`,
        );
        setStatus("success");
      } catch (err: any) {
        const msg = err.message?.toLowerCase() || "";
        if (msg.includes("expired")) setStatus("expired");
        else if (msg.includes("invalid")) setStatus("invalid");
        else setStatus("error");
      }
    }

    verify();
  }, [token, email]);

  async function resend() {
    if (!email) return;

    try {
      setResending(true);
      setMessage("");

      await apiClient.post(`${BACKEND}/api/auth/resend-verification`, {
        email,
      });

      setMessage("Verification email sent. Please check your inbox.");
    } catch {
      setMessage("Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-xl p-6 text-center space-y-4"
      >
        {status === "loading" && <p>Verifying your email…</p>}

        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-5xl"
            >
              ✅
            </motion.div>
            <h1 className="text-xl font-semibold text-green-600">
              Email verified!
            </h1>
            <p>You can now sign in to Picstoria.</p>
            <Link href="/login">
              <Button className="w-full mt-4">Sign in</Button>
            </Link>
          </>
        )}

        {(status === "expired" || status === "error") && (
          <>
            <h1 className="text-xl font-semibold text-yellow-600">
              Verification link expired
            </h1>
            <p>Please request a new one.</p>
            <Button onClick={resend} disabled={resending} className="w-full">
              {resending ? "Sending…" : "Resend verification link"}
            </Button>
            {message && <p className="text-sm mt-2">{message}</p>}
          </>
        )}

        {status === "invalid" && (
          <>
            <h1 className="text-xl font-semibold text-red-600">
              Invalid verification link
            </h1>
            <Link href="/signup">
              <Button variant="outline" className="w-full mt-4">
                Go to signup
              </Button>
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmail />
    </Suspense>
  );
}
