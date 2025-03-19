"use client";

import { useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  MarkerType,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { TableName } from "@/lib/types";
import { getJoinRelationship } from "@/lib/joinUtils";
import ReactFlowWrapper from "./ReactFlowWrapper";

interface SchemaERDProps {
  leftTable: TableName;
  rightTable: TableName;
}

// Custom table node component
const TableNode = ({ data }: { data: any }) => {
  const { table, columns, isHighlighted } = data;
  
  return (
    <div className={`px-2 py-1 rounded-md border-2 ${
      isHighlighted ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-white"
    }`}>
      <div className="font-bold text-center border-b border-gray-200 pb-1 mb-1 text-gray-900">
        {table.charAt(0).toUpperCase() + table.slice(1)}
      </div>
      <div className="text-xs">
        {columns.map((col: { name: string; key: boolean; type: string; fk?: boolean }) => {
          // Clean up the type display - remove "| null" for display purposes
          const displayType = col.type.replace(" | null", "");
          
          return (
            <div 
              key={col.name} 
              className={`py-1 ${col.key ? "font-semibold" : ""} ${
                data.joinColumns?.includes(col.name) ? "text-indigo-600" : "text-gray-900"
              }`}
            >
              {col.name}: {displayType} {col.key ? "(PK)" : ""} {col.fk ? "(FK)" : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Node types
const nodeTypes = {
  tableNode: TableNode,
};

const SchemaERDContent = ({ leftTable, rightTable }: SchemaERDProps) => {
  // Get relationship between tables
  const { leftKey, rightKey } = getJoinRelationship(leftTable, rightTable);
  
  // Define table schema
  const tableSchema = {
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
  };
  
  // Create initial nodes
  const initialNodes: Node[] = [
    {
      id: "employees",
      type: "tableNode",
      position: { x: 50, y: 50 },
      data: { 
        table: "employees", 
        columns: tableSchema.employees.columns, 
        isHighlighted: leftTable === "employees" || rightTable === "employees",
        joinColumns: leftTable === "employees" ? [leftKey] : rightTable === "employees" ? [rightKey] : [],
      },
    },
    {
      id: "departments",
      type: "tableNode",
      position: { x: 350, y: 50 },
      data: { 
        table: "departments", 
        columns: tableSchema.departments.columns, 
        isHighlighted: leftTable === "departments" || rightTable === "departments",
        joinColumns: leftTable === "departments" ? [leftKey] : rightTable === "departments" ? [rightKey] : [],
      },
    },
    {
      id: "offices",
      type: "tableNode",
      position: { x: 200, y: 220 },
      data: { 
        table: "offices", 
        columns: tableSchema.offices.columns, 
        isHighlighted: leftTable === "offices" || rightTable === "offices",
        joinColumns: leftTable === "offices" ? [leftKey] : rightTable === "offices" ? [rightKey] : [],
      },
      style: {
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "5px",
        padding: "10px",
        width: "180px",
      },
    },
  ];
  
  // Create initial edges
  const initialEdges: Edge[] = [
    {
      id: "emp-dept",
      source: "employees",
      target: "departments",
      sourceHandle: "dept_id",
      targetHandle: "dept_id",
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: {
        strokeWidth: 2,
        stroke: (leftTable === "employees" && rightTable === "departments") || 
                (leftTable === "departments" && rightTable === "employees") 
                ? "#4f46e5" : "#9ca3af",
      },
      animated: (leftTable === "employees" && rightTable === "departments") || 
               (leftTable === "departments" && rightTable === "employees"),
    },
    {
      id: "emp-office",
      source: "employees",
      target: "offices",
      sourceHandle: "office_id",
      targetHandle: "office_id",
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: {
        strokeWidth: 2,
        stroke: (leftTable === "employees" && rightTable === "offices") || 
                (leftTable === "offices" && rightTable === "employees") 
                ? "#4f46e5" : "#9ca3af",
      },
      animated: (leftTable === "employees" && rightTable === "offices") || 
                (leftTable === "offices" && rightTable === "employees"),
    },
  ];
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();
  
  // Update nodes and edges when tables change
  useEffect(() => {
    setNodes(prevNodes => {
      return prevNodes.map(node => {
        const isLeftTable = node.id === leftTable;
        const isRightTable = node.id === rightTable;
        
        return {
          ...node,
          data: {
            ...node.data,
            isHighlighted: isLeftTable || isRightTable,
            joinColumns: isLeftTable ? [leftKey] : isRightTable ? [rightKey] : [],
          },
        };
      });
    });
    
    setEdges(prevEdges => {
      return prevEdges.map(edge => {
        const isRelevantEdge = 
          (edge.source === leftTable && edge.target === rightTable) ||
          (edge.source === rightTable && edge.target === leftTable);
        
        return {
          ...edge,
          style: {
            ...edge.style,
            stroke: isRelevantEdge ? "#4f46e5" : "#9ca3af",
          },
          animated: isRelevantEdge,
        };
      });
    });
    
    // Fit view when tables change
    setTimeout(() => fitView({ padding: 0.2 }), 0);
  }, [leftTable, rightTable, leftKey, rightKey, setNodes, setEdges, fitView]);
  
  // Fit view on mount
  useEffect(() => {
    setTimeout(() => fitView({ padding: 0.2 }), 0);
  }, [fitView]);
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      attributionPosition="bottom-right"
    >
      <Panel position="top-right">
        <div className="bg-white p-2 rounded-md shadow-sm text-xs text-gray-900">
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
            <span>Selected Tables</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
            <span>Other Tables</span>
          </div>
        </div>
      </Panel>
    </ReactFlow>
  );
};

// Wrapper component that includes ReactFlowProvider
const SchemaERD = (props: SchemaERDProps) => {
  return (
    <div className="h-[300px] w-full rounded-md bg-white">
      <ReactFlowWrapper>
        <SchemaERDContent {...props} />
      </ReactFlowWrapper>
    </div>
  );
};

export default SchemaERD; 