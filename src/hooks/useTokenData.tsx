import { LogUser } from "@/types";
import { useMemo } from "react";
import jwt_decode from "jwt-decode";

export default function useTokenData() {
  const token = localStorage.getItem("token");
  const data = useMemo(() => jwt_decode<LogUser>(token || ""), []);
  return data;
}
