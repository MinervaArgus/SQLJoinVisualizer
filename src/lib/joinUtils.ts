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
  // A RIGHT JOIN is just a LEFT JOIN with tables swapped, then rearranged
  const swappedResult = leftJoin(rightTable, leftTable);
  
  // Rearrange the result to match the original left/right table order
  const result: JoinResult = swappedResult.map(row => {
    const rearrangedRow: Record<string, any> = {};
    Object.entries(row).forEach(([key, value]) => {
      rearrangedRow[key] = value;
    });
    return rearrangedRow;
  });
  
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

// Perform a join based on the specified type
export function performJoin(leftTable: TableName, rightTable: TableName, joinType: JoinType): JoinResult {
  switch (joinType) {
    case "INNER":
      return innerJoin(leftTable, rightTable);
    case "LEFT":
      return leftJoin(leftTable, rightTable);
    case "RIGHT":
      return rightJoin(leftTable, rightTable);
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
  
  // Get all values from right table for the join key
  const rightValues = new Set<number>();
  rightData.forEach(row => {
    const value = row[rightKey as keyof typeof row];
    if (value !== null && typeof value === 'number') {
      rightValues.add(value);
    }
  });
  
  // Count rows that have matching values
  let overlap = 0;
  for (const leftRow of leftData) {
    const leftValue = leftRow[leftKey as keyof typeof leftRow];
    if (leftValue !== null && rightValues.has(leftValue as number)) {
      overlap++;
    }
  }
  
  // Left only = rows in left that don't match any in right
  const leftOnly = leftData.length - overlap;
  
  // Get count of unique right values that match something in the left
  const leftValuesWithMatch = new Set<number>();
  leftData.forEach(row => {
    const value = row[leftKey as keyof typeof row];
    if (value !== null && typeof value === 'number') {
      leftValuesWithMatch.add(value);
    }
  });
  
  const matchingRightRows = rightData.filter(row => {
    const rightValue = row[rightKey as keyof typeof row];
    return rightValue !== null && leftValuesWithMatch.has(rightValue as number);
  }).length;
  
  // Right only = rows in right that don't match any in left
  const rightOnly = rightData.length - matchingRightRows;
  
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
    case "CROSS":
      total = leftData.length * rightData.length;
      break;
    default:
      total = overlap;
  }
  
  return { leftOnly, rightOnly, overlap, total };
} 