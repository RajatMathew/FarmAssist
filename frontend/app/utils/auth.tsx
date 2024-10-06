// utils/auth.ts
import { jwtDecode } from "jwt-decode";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface LoginResponse {
  status: string;
  access_token: string;
}

interface SignupResponse {
  status: string;
  message?: string;
  token?: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // This is important for cookies if you're using them
    });

    console.log("AUTH Login response:", response);
    if (!response.ok) {
      throw new Error("Login failed");
    }

    const { access_token, name, userId } = await response.json();

    localStorage.setItem("token", access_token);
    localStorage.setItem("email", email);
    localStorage.setItem("name", name);
    localStorage.setItem("userId", userId);

    return { status: "success", access_token: access_token };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  localStorage.removeItem("userId");
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    // console.log("Decoded token:", decodedToken);
    return true;
  } catch (error) {
    console.error("Token error:", error);
    return false;
  }
};

export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<SignupResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/users/signup/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error("Signup failed");
    }

    const data: SignupResponse = await response.json();
    console.log("AUTH Signup data:", data);
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};
