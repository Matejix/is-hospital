import { Table, TableProps } from "@mantine/core";
import { ReactNode } from "react";

type Props<T> = {
  data: T[];
  tableHeaders: Array<ReactNode | string>;
  tableRow: (item: T) => ReactNode;
};

function ReusableTable<T>({ data, tableHeaders, tableRow }: Props<T>) {
  const rows = data.map((element) => tableRow(element));

  return (
    <Table className="m-auto max-w-full">
      <thead className=" bg-blue-400">
        <tr>
          {tableHeaders.map((header) => (
            <th>
              <span key={header?.toString()} className="text-white text-lg">
                {header}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default ReusableTable;
