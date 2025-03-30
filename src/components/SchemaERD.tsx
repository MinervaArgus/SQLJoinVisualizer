"use client";

import { useMemo } from "react";
import { TableName } from "@/lib/types";
import { getJoinRelationship } from "@/lib/joinUtils";

interface SchemaERDProps {
  leftTable: TableName;
  rightTable: TableName;
}

// Table component with schema info
const TableBox = ({ 
  table, 
  columns, 
  isHighlighted, 
  joinColumn 
}: { 
  table: string; 
  columns: { name: string; key: boolean; type: string; fk?: boolean }[]; 
  isHighlighted: boolean;
  joinColumn?: string;
}) => {
  return (
    <div className={`w-[150px] px-2 py-1.5 rounded border-2 ${
      isHighlighted 
        ? "border-indigo-500 bg-gray-900" 
        : "border-gray-700 bg-gray-900"
    }`}>
      <div className={`font-medium text-sm text-center border-b border-gray-700 pb-1 mb-1 ${
        isHighlighted ? "text-indigo-400" : "text-gray-200"
      }`}>
        {table}
      </div>
      <div>
        {columns.map((col) => {
          const displayType = col.type.replace(" | null", "");
          return (
            <div 
              key={col.name} 
              className={`py-0.5 flex justify-between items-center ${col.key ? "font-medium" : ""} ${
                col.name === joinColumn
                  ? "text-indigo-300" 
                  : "text-gray-300"
              }`}
            >
              <span className="text-xs">{col.name}</span>
              <span className="text-xs opacity-90">
                {displayType} 
                {col.key && <span className="ml-1 text-amber-400">(PK)</span>} 
                {col.fk && <span className="ml-1 text-blue-400">(FK)</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SchemaERD = ({ leftTable, rightTable }: SchemaERDProps) => {
  // Get relationship between tables
  const { leftKey, rightKey } = getJoinRelationship(leftTable, rightTable);
  
  // Define table schema - memoized to prevent re-renders
  const tableSchema = useMemo(() => ({
    employees: {
      columns: [
        { name: "emp_id", key: true, type: "number" },
        { name: "name", key: false, type: "string" },
        { name: "dept_id", key: false, type: "number", fk: true },
        { name: "office_id", key: false, type: "number", fk: true },
      ],
    },
    departments: {
      columns: [
        { name: "dept_id", key: true, type: "number" },
        { name: "dept_name", key: false, type: "string" },
      ],
    },
    offices: {
      columns: [
        { name: "office_id", key: true, type: "number" },
        { name: "location", key: false, type: "string" },
      ],
    },
  }), []);
  
  // Check if selected tables have a relationship - memoized
  const noDirectRelationship = useMemo(() => 
    (leftTable === "departments" && rightTable === "offices") || 
    (leftTable === "offices" && rightTable === "departments"),
  [leftTable, rightTable]);
  
  return (
    <div className="h-[400px] w-full rounded-xl bg-gray-950 border border-gray-800 relative">
      {/* Legend */}
      <div className="absolute top-0 right-0 bg-gray-900 p-2 min-w-[200px]">
        <div className="text-sm font-medium text-gray-200 border-b border-gray-700 pb-1 mb-1">
          Table Legend
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-gray-300 text-xs">Selected Tables</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <span className="text-gray-400 text-xs">Other Tables</span>
          </div>
          <div className="text-xs mt-1 pt-1 border-t border-gray-700">
            <span className="text-indigo-400">Note:</span>
            <span className="text-gray-300"> Departments and Offices do not have a direct relationship.</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-[600px] h-[300px]">
          {/* Employees table - top */}
          <div className="absolute left-1/2 -translate-x-1/2 top-20">
            <TableBox 
              table="Employees" 
              columns={tableSchema.employees.columns}
              isHighlighted={leftTable === "employees" || rightTable === "employees"}
              joinColumn={leftTable === "employees" ? leftKey : rightTable === "employees" ? rightKey : undefined}
            />
          </div>
          
          {/* Departments table - bottom left */}
          <div className="absolute left-10 bottom-[-40px]">
            <TableBox 
              table="Departments" 
              columns={tableSchema.departments.columns}
              isHighlighted={leftTable === "departments" || rightTable === "departments"}
              joinColumn={leftTable === "departments" ? leftKey : rightTable === "departments" ? rightKey : undefined}
            />
          </div>
          
          {/* Offices table - bottom right */}
          <div className="absolute right-10 bottom-[-40px]">
            <TableBox 
              table="Offices" 
              columns={tableSchema.offices.columns}
              isHighlighted={leftTable === "offices" || rightTable === "offices"}
              joinColumn={leftTable === "offices" ? leftKey : rightTable === "offices" ? rightKey : undefined}
            />
          </div>

          {/* Relationship Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line 
              x1="50%" 
              y1="205" 
              x2="20%" 
              y2="255" 
              stroke="#4f46e5" 
              strokeWidth="2"
              className="opacity-70"
            />
            <line 
              x1="50%" 
              y1="205" 
              x2="80%" 
              y2="255" 
              stroke="#4f46e5" 
              strokeWidth="2"
              className="opacity-70"
            />
            {noDirectRelationship && (
              <line 
                x1="20%" 
                y1="250" 
                x2="80%" 
                y2="250" 
                stroke="#ef4444" 
                strokeWidth="2"
                strokeDasharray="4,4"
                className="opacity-60"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SchemaERD; 