import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

function AuthGate({ children }: Props) {
  const token = localStorage.getItem("token");

  return token !== null ? <>{children}</> : <Navigate to={"/"} replace />;
}

export default AuthGate;
