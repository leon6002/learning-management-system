"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { LOGIN_ROUTE } from "@/routes";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "redirect" | "modal";
  asChild?: boolean;
}

const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    console.log("LoginButton clicked");
    router.push(LOGIN_ROUTE);
  };

  if (mode === "modal") {
    return <span>TODO: Implemnt modal</span>;
  }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;
