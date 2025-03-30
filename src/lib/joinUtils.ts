import schema from "@/data/schema.json";
import { JoinType, TableName, JoinResult, Schema } from "./types";

// Type the schema explicitly
const typedSchema = schema as Schema;

// Get the join relationship between two tables
export function getJoinRelationship(leftTable: TableName, rightTable: TableName): { leftKey: string; rightKey: string } {
  // Default join keys based on table names
  const relationships: Record<string, Record<string, { leftKey: string; rightKey: string }>> = {
    employees: {
      departments: { leftKey: "dept_id", rightKey: "dept_id" },
      offices: { leftKey: "office_id", rightKey: "office_id" }
    },
    departments: {
      employees: { leftKey: "dept_id", rightKey: "dept_id" }
    },
    offices: {
      employees: { leftKey: "office_id", rightKey: "office_id" }
    }
  };

  return relationships[leftTable]?.[rightTable] || { leftKey: "", rightKey: "" };
}

// Perform an INNER JOIN operation
export function innerJoin(leftTable: TableName, rightTable: TableName): JoinResult {
  const { leftKey, rightKey } = getJoinRelationship(leftTable, rightTable);
  const leftData = typedSchema[leftTable];
  const rightData = typedSchema[rightTable];
  
  const result: JoinResult = [];
  
  for (const leftRow of leftData) {
    for (const rightRow of rightData) {
      // Access with bracket notation using type assertion
      const leftValue = leftRow[leftKey as keyof typeof leftRow];
      const rightValue = rightRow[rightKey as keyof typeof rightRow];
      
      if (leftValue !== null && leftValue === rightValue) {
        // Combine the rows, prefixing keys with table names to avoid collisions
        const joinedRow: Record<string, any> = {};
        Object.entries(leftRow).forEach(([key, value]) => {
          joinedRow[`${leftTable}_${key}`] = value;
        });
        Object.entries(rightRow).forEach(([key, value]) => {
          joinedRow[`${rightTable}_${key}`] = value;
        });
        result.push(joinedRow);
      }
    }
  }
  
  return result;
}

// Perform a LEFT JOIN operation
export function leftJoin(leftTable: TableName, rightTable: TableName): JoinResult {
  const { leftKey, rightKey } = getJoinRelationship(leftTable, rightTable);
  const leftData = typedSchema[leftTable];
  const rightData = typedSchema[rightTable];
  
  const result: JoinResult = [];
  
  for (const leftRow of leftData) {
    let matchFound = false;
    const leftValue = leftRow[leftKey as keyof typeof leftRow];
    
    for (const rightRow of rightData) {
      const rightValue = rightRow[rightKey as keyof typeof rightRow];
      
      if (leftValue !== null && leftValue === rightValue) {
        // Combine the rows when there's a match
        const joinedRow: Record<string, any> = {};
        Object.entries(leftRow).forEach(([key, value]) => {
          joinedRow[`${leftTable}_${key}`] = value;
        });
        Object.entries(rightRow).forEach(([key, value]) => {
          joinedRow[`${rightTable}_${key}`] = value;
        });
        result.push(joinedRow);
        matchFound = true;
      }
    }
    
    // If no match, include left row with nulls for right
    if (!matchFound) {
      const joinedRow: Record<string, any> = {};
      Object.entries(leftRow).forEach(([key, value]) => {
        joinedRow[`${leftTable}_${key}`] = value;
      });
      // Add null values for all right table columns
      const rightRow = rightData[0] || {}; // Use the first row to get structure
      Object.keys(rightRow).forEach(key => {
        joinedRow[`${rightTable}_${key}`] = null;
      });
      result.push(joinedRow);
    }
  }
  
  return result;
}

// Perform a RIGHT JOIN operation
export function rightJoin(leftTable: TableName, rightTable: TableName): JoinResult {
  const { leftKey, rightKey } = getJoinRelationship(leftTable, rightTable);
  const leftData = typedSchema[leftTable];
  const rightData = typedSchema[rightTable];
  
  const result: JoinResult = [];
  
  // Right join: all right rows are included, left rows only if there's a match
  for (const rightRow of rightData) {
    let matchFound = false;
    const rightValue = rightRow[rightKey as keyof typeof rightRow];
    
    for (const leftRow of leftData) {
      const leftValue = leftRow[leftKey as keyof typeof leftRow];
      
      if (rightValue !== null && rightValue === leftValue) {
        // Combine the rows when there's a match
        const joinedRow: Record<string, any> = {};
        Object.entries(leftRow).forEach(([key, value]) => {
          joinedRow[`${leftTable}_${key}`] = value;
        });
        Object.entries(rightRow).forEach(([key, value]) => {
          joinedRow[`${rightTable}_${key}`] = value;
        });
        result.push(joinedRow);
        matchFound = true;
      }
    }
    
    // If no match, include right row with nulls for left
    if (!matchFound) {
      const joinedRow: Record<string, any> = {};
      // Add null values for all left table columns
      const leftRow = leftData[0] || {}; // Use the first row to get structure
      Object.keys(leftRow).forEach(key => {
        joinedRow[`${leftTable}_${key}`] = null;
      });
      // Add right table values
      Object.entries(rightRow).forEach(([key, value]) => {
        joinedRow[`${rightTable}_${key}`] = value;
      });
      result.push(joinedRow);
    }
  }
  
  return result;
}

// Perform a CROSS JOIN operation
export function crossJoin(leftTable: TableName, rightTable: TableName): JoinResult {
  const leftData = typedSchema[leftTable];
  const rightData = typedSchema[rightTable];
  
  const result: JoinResult = [];
  
  for (const leftRow of leftData) {
    for (const rightRow of rightData) {
      // Combine every row from left with every row from right
      const joinedRow: Record<string, any> = {};
      Object.entries(leftRow).forEach(([key, value]) => {
        joinedRow[`${leftTable}_${key}`] = value;
      });
      Object.entries(rightRow).forEach(([key, value]) => {
        joinedRow[`${rightTable}_${key}`] = value;
      });
      result.push(joinedRow);
    }
  }
  
  return result;
}

// Perform a FULL OUTER JOIN operation
export function fullOuterJoin(leftTable: TableName, rightTable: TableName): JoinResult {
  const leftJoinResult = leftJoin(leftTable, rightTable);
  const rightJoinResult = rightJoin(leftTable, rightTable);
  
  // Get all rows from left join
  const result = [...leftJoinResult];
  
  // Find rows from right join that aren't in the left join result
  // These are rows that exist only in the right table with no match in the left
  const leftKeyName = `${leftTable}_${getJoinRelationship(leftTable, rightTable).leftKey}`;
  
  const leftKeyValues = new Set(
    leftJoinResult
      .filter(row => row[leftKeyName] !== null)
      .map(row => row[leftKeyName])
  );
  
  // Add rows from right join that have null in the left key column
  // which means they don't exist in the left table
  rightJoinResult.forEach(row => {
    if (row[leftKeyName] === null) {
      result.push(row);
    }
  });
  
  return result;
}

// Perform a join based on the specified type
export function performJoin(leftTable: TableName, rightTable: TableName, joinType: JoinType): JoinResult {
  switch (joinType) {
    case "INNER":
      return innerJoin(leftTable, rightTable);
    case "LEFT":
      return leftJoin(leftTable, rightTable);
    case "RIGHT":
      return rightJoin(leftTable, rightTable);
    case "FULL":
      return fullOuterJoin(leftTable, rightTable);
    case "CROSS":
      return crossJoin(leftTable, rightTable);
    default:
      return innerJoin(leftTable, rightTable);
  }
}

// Calculate statistics for Venn diagrams
export function calculateJoinStats(leftTable: TableName, rightTable: TableName, joinType: JoinType): { 
  leftOnly: number; 
  rightOnly: number; 
  overlap: number; 
  total: number;
} {
  const leftData = typedSchema[leftTable];
  const rightData = typedSchema[rightTable];
  const { leftKey, rightKey } = getJoinRelationship(leftTable, rightTable);
  
  // Handle CROSS JOIN separately, as it's a special case
  if (joinType === "CROSS") {
    // In a CROSS JOIN, each row on the left is paired with every row on the right
    // So the overlap is the full count of both sides multiplied
    const overlap = leftData.length * rightData.length;
    return {
      leftOnly: 0,    // No rows are "left only" in a CROSS join
      rightOnly: 0,   // No rows are "right only" in a CROSS join
      overlap,        // All possible combinations
      total: overlap  // Total is the same as overlap for CROSS joins
    };
  }
  
  // For all other join types:
  // Get matching values arrays for accurate counting
  const matchingLeftValues = new Set<number | null>();
  const matchingRightValues = new Set<number | null>();
  
  // Process the left table values (collect all non-null values)
  const leftKeyValues = new Map<number, number>();
  for (const leftRow of leftData) {
    const leftValue = leftRow[leftKey as keyof typeof leftRow];
    if (leftValue !== null) {
      const currentCount = leftKeyValues.get(leftValue as number) || 0;
      leftKeyValues.set(leftValue as number, currentCount + 1);
    }
  }
  
  // Process the right table values (collect all non-null values)
  const rightKeyValues = new Map<number, number>();
  for (const rightRow of rightData) {
    const rightValue = rightRow[rightKey as keyof typeof rightRow];
    if (rightValue !== null) {
      const currentCount = rightKeyValues.get(rightValue as number) || 0;
      rightKeyValues.set(rightValue as number, currentCount + 1);
    }
  }
  
  // Calculate overlap by counting rows with matching values
  let overlap = 0;
  
  // Rows in left table that match any in right table
  leftKeyValues.forEach((count, value) => {
    if (rightKeyValues.has(value)) {
      // Count as overlap - all rows with this value match
      overlap += count;
      matchingLeftValues.add(value);
    }
  });
  
  // Count right matches (rows in right table that match any in left table)
  let rightMatches_count = 0;
  rightKeyValues.forEach((count, value) => {
    if (leftKeyValues.has(value)) {
      rightMatches_count += count;
      matchingRightValues.add(value);
    }
  });
  
  // Calculate left-only and right-only counts
  // Left only = rows in left that don't match any in right
  const leftOnly = leftData.length - overlap;
  
  // Right only = rows in right that don't match any in left
  const rightOnly = rightData.length - rightMatches_count;
  
  // Total depends on join type
  let total;
  switch (joinType) {
    case "INNER":
      total = overlap;
      break;
    case "LEFT":
      total = leftData.length;
      break;
    case "RIGHT":
      total = rightData.length;
      break;
    case "FULL":
      total = leftOnly + overlap + rightOnly;
      break;
    default:
      total = overlap;
  }
  
  return { leftOnly, rightOnly, overlap, total };
} 