import EmployeeCard from "@/components/EmployeeCard";
import useTokenData from "@/hooks/useTokenData";
import axios from "axios";
import { useEffect, useState } from "react";
import { ProfileInfo } from "@/types";

const Profile = () => {
  const data = useTokenData();
  const [userInfo, setUserInfo] = useState<ProfileInfo>();
  //console.log(data);

  const postLoggedInfo = () => {
    axios
      .post("http://localhost:3000/profile", {
        id_employee: data.id_employee,
      })
      .then((response: any) => {
        console.log(response.data);
        setUserInfo(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(postLoggedInfo, []);
  console.log("USER INFO:", userInfo);
  return (
    <div className="min-h-screen flex items-center justify-center m-auto">
      <EmployeeCard
        avatar={userInfo?.FOTOGRAFIA || null}
        name={userInfo?.CELE_MENO || "Neznáme"}
        title={userInfo?.TITUL || "Neznáme"}
        phone={userInfo?.TEL || "Neznáme"}
        email={userInfo?.EMAIL || "Neznáme"}
        occupation={userInfo?.NAZOV || "Neznáme"}
      />
    </div>
  );
};

export default Profile;
