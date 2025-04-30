export interface ExcelRow {
  Fornavn?: string | number | boolean | Date
  Etternavn?: string | number | boolean | Date
  Adresse?: string | number | boolean | Date
  Kommune?: string | number | boolean | Date
  'Vår utført'?: boolean | string | number | Date
  'Høst utført'?: boolean | string | number | Date
  'E-post'?: string | number | boolean | Date
  Fakturert?: boolean | string | number | Date
  Fornyelsesdato?: number | string | boolean | Date
  Sum?: string | number | boolean | Date
  Notat?: string | number | boolean | Date
}
