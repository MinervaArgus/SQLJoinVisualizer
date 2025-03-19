import { TableName } from "@/lib/types";

interface TableSelectorProps {
  leftTable: TableName;
  rightTable: TableName;
  setLeftTable: (table: TableName) => void;
  setRightTable: (table: TableName) => void;
}

const TableSelector = ({ leftTable, rightTable, setLeftTable, setRightTable }: TableSelectorProps) => {
  const tables: TableName[] = ["employees", "departments", "offices"];
  
  // Handle left table change
  const handleLeftTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLeftTable = e.target.value as TableName;
    setLeftTable(newLeftTable);
    
    // If both tables are the same, change the right table
    if (newLeftTable === rightTable) {
      const nextTable = tables.find(t => t !== newLeftTable) || tables[0];
      setRightTable(nextTable);
    }
  };
  
  // Handle right table change
  const handleRightTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRightTable = e.target.value as TableName;
    setRightTable(newRightTable);
    
    // If both tables are the same, change the left table
    if (newRightTable === leftTable) {
      const nextTable = tables.find(t => t !== newRightTable) || tables[0];
      setLeftTable(nextTable);
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Table Selection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="leftTable" className="block text-sm font-medium text-gray-700 mb-1">
            Left Table
          </label>
          <select
            id="leftTable"
            value={leftTable}
            onChange={handleLeftTableChange}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          >
            {tables.map((table) => (
              <option key={`left-${table}`} value={table} className="text-gray-900">
                {table.charAt(0).toUpperCase() + table.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rightTable" className="block text-sm font-medium text-gray-700 mb-1">
            Right Table
          </label>
          <select
            id="rightTable"
            value={rightTable}
            onChange={handleRightTableChange}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          >
            {tables.map((table) => (
              <option key={`right-${table}`} value={table} className="text-gray-900">
                {table.charAt(0).toUpperCase() + table.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="text-sm text-gray-600 mt-2">
        <p>Select the tables to visualize join operations between them.</p>
      </div>
    </div>
  );
};

export default TableSelector; 