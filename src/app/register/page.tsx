"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: (data: { username: string; email: string; password: string }) =>
      fetcher("/api/users", "POST", data),
    onSuccess: (data) => {
      setMessage(`User registered successfully! Welcome, ${data.user.username}.`);
    },
    onError: (error: any) => {
      setMessage(error.message || "Failed to register.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, email, password });
  };

  return (
    <div className="flex flex-col items-center bg-gray-300">
      <form onSubmit={handleSubmit} className="p-4">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={mutation.status === "pending"}>
          {mutation.status === "pending" ? "Registering..." : "Register"}
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
