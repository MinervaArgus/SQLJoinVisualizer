// Table types
export type TableName = "employees" | "departments" | "offices";

// Join types
export type JoinType = "INNER" | "LEFT" | "RIGHT" | "CROSS" | "FULL";

// Data types for each table
export interface Employee {
  emp_id: number;
  name: string;
  dept_id: number | null;
  office_id: number | null;
}

export interface Department {
  dept_id: number;
  dept_name: string;
}

export interface Office {
  office_id: number;
  location: string;
}

// Combined schema type
export interface Schema {
  employees: Employee[];
  departments: Department[];
  offices: Office[];
}

// A generic type for any row from any table
export type Row = Employee | Department | Office;

// Join result type - combines properties from both tables
export type JoinResult = Record<string, any>[]; 