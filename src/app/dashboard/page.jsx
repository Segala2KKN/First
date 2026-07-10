"use client";

import { use, useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/me");

      if (res.status !== 200) {
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      setUser(data.user);
    }

    fetchUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bgb-black text-white">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-white text-black rounded-2xl"
      >q
        Logout
      </button>
    </div>
  );
}
