"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { JoinType, TableName } from "@/lib/types";
import { calculateJoinStats } from "@/lib/joinUtils";

interface VennDiagramProps {
  leftTable: TableName;
  rightTable: TableName;
  joinType: JoinType;
}

const VennDiagram = ({ leftTable, rightTable, joinType }: VennDiagramProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear existing SVG
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Get stats for the join
    const stats = calculateJoinStats(leftTable, rightTable, joinType);
    
    // Set up dimensions
    const width = 400;
    const height = 300;
    const radius = 80;
    const centerDistance = 80;  // Distance between circle centers
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");
    
    // Define gradient for inner join
    if (joinType === "INNER") {
      const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "innerJoinGradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#3b82f6") // Blue
        .attr("stop-opacity", 0.7);
        
      gradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "#8b5cf6") // Purple
        .attr("stop-opacity", 0.9);
        
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#10b981") // Green
        .attr("stop-opacity", 0.7);
    }
    
    // Append a group for the Venn diagram, centered in the SVG
    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
    // Define circles
    const leftCircle = g.append("circle")
      .attr("cx", -centerDistance / 2)
      .attr("cy", 0)
      .attr("r", radius)
      .attr("fill", "#3b82f6")  // Blue
      .attr("opacity", 0.5)
      .attr("stroke", "#1e40af")
      .attr("stroke-width", 2);
    
    const rightCircle = g.append("circle")
      .attr("cx", centerDistance / 2)
      .attr("cy", 0)
      .attr("r", radius)
      .attr("fill", "#10b981")  // Green
      .attr("opacity", 0.5)
      .attr("stroke", "#065f46")
      .attr("stroke-width", 2);
      
    // Define color constants for reuse
    const leftColor = "#3b82f6";  // Blue
    const rightColor = "#10b981"; // Green
    const blendedColor = "#4588c7"; // Teal/blue blend
      
    // Highlight circles based on join type
    switch (joinType) {
      case "INNER":
        // Make both circles use the same opacity as green circle in LEFT join
        leftCircle.attr("opacity", 0.3);
        rightCircle.attr("opacity", 0.3);
        
        // Calculate the actual intersection of two circles
        const r1 = radius;
        const r2 = radius;
        const d = centerDistance;
        
        // Ensure we can calculate a valid intersection
        if (d < r1 + r2) {
          // Simplified approach - just two overlapping ellipses for smooth edges
          
          // First: add a vertical ellipse for the core shape
          g.append("ellipse")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("rx", radius * 0.55) // Wider to ensure coverage
            .attr("ry", radius * 0.85) // Taller to ensure coverage
            .attr("fill", "#4588c7")
            .attr("opacity", 1);
            
          // Second: add a horizontal ellipse to ensure corners are filled
          g.append("ellipse")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("rx", radius * 0.5) // Wide enough to cover edges
            .attr("ry", radius * 0.5) // Not too tall to avoid distortion
            .attr("fill", "#4588c7")
            .attr("opacity", 1);
        }
        break;
      case "LEFT":
        // Full opacity for left, lower for right
        leftCircle.attr("opacity", 0.7);
        rightCircle.attr("opacity", 0.3);
        break;
      case "RIGHT":
        // Full opacity for right, lower for left
        leftCircle.attr("opacity", 0.3);
        rightCircle.attr("opacity", 0.7);
        break;
      case "CROSS":
        // Equal opacity for both
        leftCircle.attr("opacity", 0.7);
        rightCircle.attr("opacity", 0.7);
        break;
    }
    
    // Add labels for tables
    g.append("text")
      .attr("x", -centerDistance / 2 - 10)
      .attr("y", -radius - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#111827") // Dark gray/black text
      .text(leftTable.charAt(0).toUpperCase() + leftTable.slice(1));
    
    g.append("text")
      .attr("x", centerDistance / 2 + 10)
      .attr("y", -radius - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#111827") // Dark gray/black text
      .text(rightTable.charAt(0).toUpperCase() + rightTable.slice(1));
    
    // Add counts
    g.append("text")
      .attr("x", -centerDistance - radius/2)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#111827") // Dark gray/black text
      .text(stats.leftOnly.toString());
    
    g.append("text")
      .attr("x", centerDistance + radius/2)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#111827") // Dark gray/black text
      .text(stats.rightOnly.toString());
    
    g.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#111827") // Dark gray/black text
      .text(stats.overlap.toString());
    
    // Add a legend for the join type
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#111827") // Dark gray/black text
      .text(`${joinType} JOIN (${stats.total} rows)`);
      
    // Add description text
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#6b7280")
      .text(getJoinDescription(joinType));
  }, [leftTable, rightTable, joinType]);
  
  // Helper function to get join description
  function getJoinDescription(joinType: JoinType): string {
    switch (joinType) {
      case "INNER":
        return "Only matching rows from both tables";
      case "LEFT":
        return "All rows from left table, matching rows from right";
      case "RIGHT":
        return "All rows from right table, matching rows from left";
      case "CROSS":
        return "All possible combinations of rows";
      default:
        return "";
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] overflow-hidden">
      <svg ref={svgRef} className="w-full max-w-md"></svg>
    </div>
  );
};

export default VennDiagram; 