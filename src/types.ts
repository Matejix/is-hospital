export type LogUser = {
  password: string;
  id_employee: number;
  username: string;
  exp: number;
  iat: number;
};

export interface MedicineData {
  ID_KOD_LIEKU: number;
  NAZOV: string;
}

export interface PatientsData {
  MENO: string;
  PRIEZVISKO: string;
  ROD_CISLO: string;
  ULICA: string;
  NAZOV_MESTA: string;
  NAZOV: string; // poistovna
}
export interface TableSortProps {
  data: PatientsData[];
}
