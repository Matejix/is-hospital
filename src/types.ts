export type LogUser = {
  password: string;
  id_employee: number;
  username: string;
  role: string;
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

export interface BasicInfo {
  ROD_CISLO: string;
  TITUL: string;
  MENO: string;
  PRIEZVISKO: string;
  RODNE_PRIEZVISKO: string;
  ULICA: string;
  PSC: string;
  NAZOV_MESTA: string;
  DATUM_NARODENIA: Date;
  DATUM_UMRTIA: Date;
  KRVNA_SKUPINA: string;
  ZAMESTNANIE: string;
  POISTOVNA: string;
}

export interface Records {
  ID_ZAZNAM: string;
  DATUM_ZAZNAMU: Date;
  ZAZNAM: string;
  TYP: string;
  POPIS: string;
  DAVKOVANIE_MEDIKACIE: string;
  NAZOV_DIAGNOZY: string;
  VYSTAVIL: string;
  ODDELENIE: string;
}

export interface Requests {
  ID_ZIADANKY: string;
  DAT_VYSTAVENIA: Date;
  POPIS: string;
  NAZOV_DIAGNOZY: string;
  VYSTAVIL: string;
  ODDELENIE: string;
}

export interface Prescriptions {
  PREDPISY: {
    kod: Number;
    vystavil: string;
    liek: string[];
    popis: string;
  };
}

export interface ScheduleDate{
  ODDELENIE: string,
  DAT_OD: Date;
  DAT_DO: Date;
}

export interface ScheduleEmployeeDate{
  ID_DOCHADZKY: number;
  ID_ZAMESTNANEC: number;
  CELE_MENO: string;
  ODDELENIE: string,
  DAT_OD: Date;
  DAT_DO: Date;
}

export interface Dates{
  DAT: Date;
}

export interface Cities{
  NAZOV_MESTA: string;
  PSC: string;
}

export interface BloodTypes{
  KRVNA_SKUPINA: string;
}

export interface Insurance{
  ID_POISTOVNA: number;
  NAZOV: string;
}

export interface EmployeeNames{
  ID_ZAMESTNANEC: number;
  CELE_MENO: string;
}

export interface ProfileInfo {
  FOTOGRAFIA: Buffer;
  CELE_MENO: string;
  TITUL: string;
  TEL: string;
  EMAIL: string;
  NAZOV: string;
}
