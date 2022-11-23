import useReportItems from "@/hooks/useReportItems";
import { Navbar, ScrollArea, Text } from "@mantine/core";
import { Link } from "react-router-dom";

type Props = {};

const Reports = () => {
  const reportItems = useReportItems();
  return (
    <Navbar className="bg-blue-50" height={300} p="xs" width={{ base: 200 }}>
      <Navbar.Section className="text-xl uppercase tracking-widest border-b-2 border-slate-400 font-bold text-slate-700 mt-3 mb-3 pb-3">
        Reporty
      </Navbar.Section>
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <div className="flex flex-col">
          {reportItems.map(({ text, link, icon }) => (
            <Link
              className="flex p-2 text-sm font-medium text-slate-600 hover:bg-blue-500 hover:text-slate-100 transition duration-200"
              to={link}
              key={link}
            >
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
