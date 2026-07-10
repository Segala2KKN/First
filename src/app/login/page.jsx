"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] =  useState("");
  const [password, setPassword] =  useState("");

  async function handleSubmit(e){
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    alert(data.message);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gray-900 p-8 rounded w-80">

        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded text-black bg-amber-300"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded text-black bg-amber-300"
        />

        <button
          type="submit"
          className="bg-white text-black py-2 rounded font-bold"
        >
          Login
        </button>
      </form>
    </main>
  );
}
