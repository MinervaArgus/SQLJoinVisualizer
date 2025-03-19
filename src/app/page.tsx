"use client";

import { useState } from "react";
import TableSelector from "@/components/TableSelector";
import JoinSelector from "@/components/JoinSelector";
import VennDiagram from "@/components/VennDiagram";
import SchemaERD from "@/components/SchemaERD";
import ResultTable from "@/components/ResultTable";
import { JoinType, TableName } from "@/lib/types";

export default function Home() {
  const [leftTable, setLeftTable] = useState<TableName>("employees");
  const [rightTable, setRightTable] = useState<TableName>("departments");
  const [joinType, setJoinType] = useState<JoinType>("INNER");
  
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SQL Joins Visualizer</h1>
        <p className="text-gray-600 mb-6">Understand SQL joins through interactive visualizations</p>
        
        {/* Top: Table & Join Selection */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TableSelector 
              leftTable={leftTable}
              rightTable={rightTable}
              setLeftTable={setLeftTable}
              setRightTable={setRightTable}
            />
            <JoinSelector 
              joinType={joinType}
              setJoinType={setJoinType}
            />
          </div>
        </div>
        
        {/* Middle: Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Venn Diagram */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Venn Diagram</h2>
            <VennDiagram 
              leftTable={leftTable}
              rightTable={rightTable}
              joinType={joinType}
            />
          </div>
          
          {/* ERD */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Entity Relationship Diagram</h2>
            <SchemaERD 
              leftTable={leftTable}
              rightTable={rightTable}
            />
          </div>
        </div>
        
        {/* Bottom: Result Table */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Resulting Dataset</h2>
          <ResultTable 
            leftTable={leftTable}
            rightTable={rightTable}
            joinType={joinType}
          />
        </div>
        
        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-8">
          SQL Joins Visualizer - An educational tool for understanding SQL joins
        </footer>
      </div>
    </main>
  );
}
