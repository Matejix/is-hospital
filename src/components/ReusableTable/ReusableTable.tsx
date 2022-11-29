import { Table, TableProps } from "@mantine/core";
import { ReactNode, useEffect } from "react";

type Props<T> = {
  data: T[];
  tableHeaders: Array<ReactNode | string>;
  tableRow: (item: T) => ReactNode;
};

function ReusableTable<T>({ data, tableHeaders, tableRow }: Props<T>) {
  useEffect(() => {
    const tableEl = document.querySelector("Table");
    setTimeout(() => {
      tableEl?.classList.replace("opacity-0", "opacity-100");
      tableEl?.classList.replace("translate-y-16", "translate-y-0");
    }, 500);
  }, []);
  const rows = data.map((element) => tableRow(element));

  return (
    <Table className="m-auto max-w-full opacity-0 translate-y-16 transition duration-300">
      <thead className=" bg-blue-400">
        <tr>
          {tableHeaders.map((header) => (
            <th key={header?.toString()}>
              <span className="text-white text-lg">{header}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default ReusableTable;
