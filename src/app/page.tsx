"use client";

import { useState } from "react";
import TableSelector from "@/components/TableSelector";
import JoinSelector from "@/components/JoinSelector";
import VennDiagram from "@/components/VennDiagram";
import SchemaERD from "@/components/SchemaERD";
import ResultTable from "@/components/ResultTable";
import OriginalDatasets from "@/components/OriginalDatasets";
import { JoinType, TableName } from "@/lib/types";

export default function Home() {
  const [leftTable, setLeftTable] = useState<TableName>("employees");
  const [rightTable, setRightTable] = useState<TableName>("departments");
  const [joinType, setJoinType] = useState<JoinType>("INNER");
  
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">SQL Joins Visualizer</h1>
          <p className="text-gray-400 mb-6">Understand SQL joins through interactive visualizations</p>
        </div>
        
        {/* Top: Table & Join Selection */}
        <div className="bg-gray-800 rounded-lg shadow p-4 md:p-6">
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
          <div className="bg-gray-800 rounded-lg shadow p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Venn Diagram</h2>
            <VennDiagram 
              leftTable={leftTable}
              rightTable={rightTable}
              joinType={joinType}
            />
          </div>
          
          {/* ERD */}
          <div className="bg-gray-800 rounded-lg shadow p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Entity Relationship Diagram</h2>
            <SchemaERD 
              leftTable={leftTable}
              rightTable={rightTable}
            />
          </div>
        </div>
        
        {/* Original Datasets - Added as requested */}
        <div className="bg-gray-800 rounded-lg shadow p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Original Datasets</h2>
          <OriginalDatasets 
            leftTable={leftTable}
            rightTable={rightTable}
          />
        </div>
        
        {/* Bottom: Result Table */}
        <div className="bg-gray-800 rounded-lg shadow p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Resulting Dataset</h2>
          <ResultTable 
            leftTable={leftTable}
            rightTable={rightTable}
            joinType={joinType}
          />
        </div>
        
        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm mt-8">
          SQL Joins Visualizer - An educational tool for understanding SQL joins
        </footer>
      </div>
    </main>
  );
}
