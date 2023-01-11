import { useMemo } from "react";
import {
  UsersIcon,
  CalendarDaysIcon,
  PencilIcon,
  DocumentPlusIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  CircleStackIcon,
} from "@heroicons/react/24/solid";

function useCardItems() {
  return useMemo(
    () => [
      {
        text: "Správa pacientov",
        icon: (
          <UsersIcon className="w-24 h-24 text-slate-700 group-hover:text-slate-50 transition duration-500" />
        ),
        link: "patient-service",
      },
      {
        text: "Rozpis služieb",
        icon: (
          <CalendarDaysIcon className="w-24 h-24 text-slate-700 group-hover:text-slate-50 transition duration-500" />
        ),
        link: "schedule",
      },
      {
        text: "Lekarsky predpis",
        icon: (
          <PencilIcon className="w-24 h-24 text-slate-700 group-hover:text-slate-50 transition duration-500" />
        ),
        link: "recipe",
      },
      {
        text: "Žiadanka",
        icon: (
          <DocumentPlusIcon className="w-24 h-24 text-slate-700 group-hover:text-slate-50 transition duration-500" />
        ),
        link: "requester",
      },
      {
        text: "Hospitalizacia",
        icon: (
          <PlusCircleIcon className="w-24 h-24 text-slate-700 group-hover:text-slate-50 transition duration-500" />
        ),
        link: "hospitalization",
      },
      // {
      //   text: "Reporty",
      //   icon: (
      //     <ClipboardDocumentListIcon className="w-24 h-24 text-slate-700 group-hover:text-slate-50 transition duration-500" />
      //   ),
      //   link: "reports",
      // },
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

export default useCardItems;
