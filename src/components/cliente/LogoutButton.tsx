"use client";

import { useState } from "react";

interface LogoutButtonProps {
  redirectTo?: string;
  className?: string;
}

export default function LogoutButton({
  redirectTo = "/cliente",
  className = "btn btn--outline",
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    try {
      await fetch("/api/cliente/logout", { method: "POST" });
    } finally {
      window.location.assign(redirectTo);
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Saindo…" : "Sair"}
    </button>
  );
}
