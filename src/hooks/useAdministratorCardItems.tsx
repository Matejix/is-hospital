import { useMemo } from "react";
import {
  UserGroupIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  CircleStackIcon,
} from "@heroicons/react/24/solid";

function useAdministratorCardItems() {
  return useMemo(
    () => [
      {
        text: "Správa zamestnancov",
        icon: (
          <UserGroupIcon className="w-24 h-24 text-slate-700 group-hover:text-slate-50 transition duration-500" />
        ),
        link: "employee-service",
      },
      {
        text: "Rozpis služieb",
        icon: (
          <CalendarDaysIcon className="w-24 h-24 text-slate-700 group-hover:text-slate-50 transition duration-500" />
        ),
        link: "schedule",
      },

      {
        text: "Reporty",
        icon: (
          <ClipboardDocumentListIcon className="w-24 h-24 text-slate-700 group-hover:text-slate-50 transition duration-500" />
        ),
        link: "reports",
      },
      {
        text: "Databázový model",
        icon: (
          <CircleStackIcon className="w-24 h-24 text-slate-700 group-hover:text-slate-50 transition duration-500" />
        ),
        link: "data-model",
      },
    ],
    []
  );
}

export default useAdministratorCardItems;
