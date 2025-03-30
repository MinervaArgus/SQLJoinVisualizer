"use client";

import { useMemo } from "react";
import { JoinType, TableName } from "@/lib/types";
import { performJoin } from "@/lib/joinUtils";

interface ResultTableProps {
  leftTable: TableName;
  rightTable: TableName;
  joinType: JoinType;
}

const ResultTable = ({ leftTable, rightTable, joinType }: ResultTableProps) => {
  // Get the join result
  const joinResult = useMemo(() => {
    return performJoin(leftTable, rightTable, joinType);
  }, [leftTable, rightTable, joinType]);
  
  // Extract column headers from the first row of the join result
  const columns = useMemo(() => {
    if (joinResult.length === 0) return [];
    
    return Object.keys(joinResult[0]).map(key => {
      // Format the column header - replace underscores with spaces and capitalize
      const [table, column] = key.split('_');
      return {
        key,
        display: `${table.charAt(0).toUpperCase() + table.slice(1)} ${column}`,
        tableName: table,
      };
    });
  }, [joinResult]);
  
  if (joinResult.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 bg-gray-50 dark:bg-gray-700 rounded-md h-[200px]">
        <p className="text-gray-600 dark:text-gray-300 italic">No matching results for this join</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider ${
                  column.tableName === leftTable 
                    ? "bg-blue-50 dark:bg-blue-900/30" 
                    : column.tableName === rightTable 
                    ? "bg-green-50 dark:bg-green-900/30" 
                    : ""
                }`}
              >
                {column.display}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {joinResult.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}>
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  className={`px-3 py-2 whitespace-nowrap text-sm ${
                    row[column.key] === null ? "text-gray-500 dark:text-gray-400 italic" : "text-gray-900 dark:text-gray-200"
                  } ${
                    column.tableName === leftTable 
                      ? "bg-blue-50 dark:bg-blue-900/30" 
                      : column.tableName === rightTable 
                      ? "bg-green-50 dark:bg-green-900/30" 
                      : ""
                  }`}
                >
                  {row[column.key] === null ? "NULL" : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
        <p>Total rows: {joinResult.length}</p>
      </div>
    </div>
  );
};

export default ResultTable; 