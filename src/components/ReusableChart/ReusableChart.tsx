import React, { ReactNode } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

type Datasets = {
  label: string;
  data: number[];
  backgroundColor: string;
};

interface Props {
  labels: string[];
  datasets: Datasets[];
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "",
    },
  },
};

const ReusableChart = ({ labels, datasets }: Props) => {
  const data = {
    labels,
    datasets,
  };
  return <Bar className="bg-slate-50" options={options} data={data} />;
};

export default ReusableChart;
