import { useMemo } from "react";
import { IconArrowRight } from "@tabler/icons";

const useReportItems = () => {
  return useMemo(
    () => [
      {
        text: "Select1",
        link: "report-1",
        icon: <IconArrowRight className="mr-3" />,
      },
      {
        text: "Select2",
        link: "report-2",
        icon: <IconArrowRight className="mr-3" />,
      },
      {
        text: "Select3",
        link: "report-3",
        icon: <IconArrowRight className="mr-3" />,
      },
      {
        text: "Select4",
        link: "report-4",
        icon: <IconArrowRight className="mr-3" />,
      },
      {
        text: "Select5",
        link: "report-5",
        icon: <IconArrowRight className="mr-3" />,
      },
      {
        text: "Select6",
        link: "report-6",
        icon: <IconArrowRight className="mr-3" />,
      },
      {
        text: "Select7",
        link: "report-7",
        icon: <IconArrowRight className="mr-3" />,
      },
      {
        text: "Select8",
        link: "report-8",
        icon: <IconArrowRight className="mr-3" />,
      },
      {
        text: "Select9",
        link: "report-9",
        icon: <IconArrowRight className="mr-3" />,
      },
      {
        text: "Select10",
        link: "report-10",
        icon: <IconArrowRight className="mr-3" />,
      },
      {
        text: "Select11",
        link: "report-11",
        icon: <IconArrowRight className="mr-3" />,
      },
      {
        text: "Select12",
        link: "report-12",
        icon: <IconArrowRight className="mr-3" />,
      },
    ],
    []
  );
};

export default useReportItems;
