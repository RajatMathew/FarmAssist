"use client";

import { useState } from "react";
import { login } from "../utils/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { access } from "fs";
import { jwtDecode } from "jwt-decode";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const loginStatus = await login(email, password);
      console.log(loginStatus);
      if (loginStatus.status === "success") {
        const decodedToken: { roles: string[] } = jwtDecode(
          loginStatus.access_token
        );
        if (decodedToken.roles.includes("admin")) {
          router.push("/admin");
        }
        if (decodedToken.roles.includes("user")) {
          router.push("/dashboard");
        }
      } else {
        alert("Login failed, please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
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
            <h2 className="text-xl tracking-tight font-semibold">Login</h2>
            <p className="text-sm text-gray-600">Login to get started</p>
          </div>

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

          <Button className="border border-gray-300 p-2" type="submit">
            Login
          </Button>
          <p className="mt-2 text-sm text-center">
            Don&apos;t have an account?
            <br />
            <Link
              className="text-blue-600 hover:text-blue-950 duration-200 font-semibold"
              href={"/sign-up"}
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
