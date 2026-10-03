"use client";
import { signIn } from "next-auth/react";
export function LoginButton() {
  return (
    <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="rounded-xl bg-gain px-4 py-3 font-medium text-black transition active:scale-95">
      Entrar com Google
    </button>
  );
}
