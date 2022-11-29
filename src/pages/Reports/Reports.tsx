import { useEffect, useState } from "react";
import useReportItems from "@/hooks/useReportItems";
import { Navbar, ScrollArea, Text } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";

const Reports = () => {
  const selectListEl = document.getElementById("navbarId");
  const { pathname } = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    if (pathname !== "/app") {
      setIsAnimating(true);
    }
    if (isAnimating) {
      selectListEl?.classList.remove("-translate-x-48");
    }
  }, [isAnimating]);

  const reportItems = useReportItems();
  return (
    <Navbar
      id="navbarId"
      className="bg-blue-50 z-10 -translate-x-48 transition duration-300"
      height={300}
      p="xs"
      width={{ base: 200 }}
    >
      <Navbar.Section className="text-xl uppercase tracking-widest border-b-2 border-slate-400 font-bold text-slate-700 mt-3 mb-3 pb-3">
        Reporty
      </Navbar.Section>
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <div className="flex flex-col">
          {reportItems.map(({ text, link, icon }) => (
            //hover:bg-blue-500 hover:text-slate-100
            <Link
              className="group flex relative p-2 text-sm font-medium text-slate-600 border-b-2 last:border-b-0 hover:text-slate-100"
              to={link}
              key={link}
            >
              <div className="w-full h-full absolute top-0 -skew-x-12 bg-blue-400 -z-10 -translate-x-48 group-hover:-translate-x-1 transition duration-200"></div>
              <Text>{icon}</Text>
              <Text>{text}</Text>
            </Link>
          ))}
        </div>
      </Navbar.Section>
    </Navbar>
  );
};

export default Reports;
