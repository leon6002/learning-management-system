import React from "react";

const AuthLayout = ({ children }: any) => {
  return (
    <div className="flex h-full items-center justify-center min-h-screen">{children}</div>
  );
};

export default AuthLayout;
