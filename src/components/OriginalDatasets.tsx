"use client";

import schema from "@/data/schema.json";
import { TableName } from "@/lib/types";

interface OriginalDatasetsProps {
  leftTable: TableName;
  rightTable: TableName;
}

const OriginalDatasets = ({ leftTable, rightTable }: OriginalDatasetsProps) => {
  // Get the schema data for selected tables
  const leftData = schema[leftTable];
  const rightData = schema[rightTable];

  // Get all possible column names for each table
  const getColumnNames = (data: any[]) => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const leftColumns = getColumnNames(leftData);
  const rightColumns = getColumnNames(rightData);

  return (
    <div className="space-y-6">
      {/* Left Table */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 capitalize">{leftTable} Table</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {leftColumns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {leftData.map((row: any, rowIndex: number) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-blue-50 dark:bg-blue-900/30" : "bg-blue-100 dark:bg-blue-900/40"}>
                  {leftColumns.map((column) => (
                    <td key={column} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {row[column] === null ? (
                        <span className="text-gray-400 dark:text-gray-500 italic">NULL</span>
                      ) : (
                        row[column]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Table */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 capitalize">{rightTable} Table</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {rightColumns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {rightData.map((row: any, rowIndex: number) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-green-50 dark:bg-green-900/30" : "bg-green-100 dark:bg-green-900/40"}>
                  {rightColumns.map((column) => (
                    <td key={column} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {row[column] === null ? (
                        <span className="text-gray-400 dark:text-gray-500 italic">NULL</span>
                      ) : (
                        row[column]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OriginalDatasets; 