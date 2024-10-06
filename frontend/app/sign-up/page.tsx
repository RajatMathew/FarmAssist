"use client";

import { useState } from "react";
import { signup } from "../utils/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const signupStatus = await signup(name, email, password);
      console.log(signupStatus);
      if (signupStatus.status != "error") {
        alert("Signup successful. Please login now.");
        router.push("/dashboard");
      } else {
        setError("Signup failed: " + signupStatus.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Signup failed: " + err.message);
      } else {
        setError("Signup failed: An unknown error occurred");
      }
    }
  };

  return (
    <div className="h-screen bg-gray-200 w-full flex items-center justify-center ">
      <div className="container mx-auto flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-white gap-4 p-4 rounded-md drop-shadow-lg border w-[350px] "
        >
          <div className="mb-4">
            <h2 className="text-xl tracking-tight font-semibold">Sign Up</h2>
            <p className="text-sm text-gray-600">Create a new account</p>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <Input
            className="border c p-2"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
          <Input
            className="border c p-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            className="border border-gray-300 p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <Input
            className="border border-gray-300 p-2"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />

          <Button className="border border-gray-300 p-2" type="submit">
            Sign Up
          </Button>
          <p className="mt-2 text-sm text-center">
            Already have an account?
            <br />
            <Link
              className="text-blue-600 hover:text-blue-950 duration-200 font-semibold"
              href={"/login"}
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
