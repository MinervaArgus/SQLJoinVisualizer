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
    
    // Get table display names (capitalized)
    const leftTableDisplay = leftTable.charAt(0).toUpperCase() + leftTable.slice(1);
    const rightTableDisplay = rightTable.charAt(0).toUpperCase() + rightTable.slice(1);
    
    // Check if we're trying to join tables without a direct relationship
    const noDirectRelationship = 
      (leftTable === "departments" && rightTable === "offices") || 
      (leftTable === "offices" && rightTable === "departments");
    
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
    
    // If there's no direct relationship, show a warning instead of Venn diagram
    if (noDirectRelationship) {
      // Add warning message
      svg.append("rect")
        .attr("x", width / 2 - 150)
        .attr("y", height / 2 - 60)
        .attr("width", 300)
        .attr("height", 120)
        .attr("fill", "#471d1d")
        .attr("rx", 8);
      
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 - 25)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "#fecaca")
        .text("No Direct Relationship");
      
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#fecaca")
        .text(`${leftTableDisplay} and ${rightTableDisplay} don't share`);
      
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 25)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#fecaca")
        .text("a foreign key relationship");
      
      return;
    }
    
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
    
    // Define color constants for reuse
    const leftColor = "#3b82f6";  // Blue
    const rightColor = "#10b981"; // Green
    const blendedColor = "#4588c7"; // Teal/blue blend
    
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
      case "FULL":
        // Both circles at full opacity for FULL OUTER JOIN
        leftCircle.attr("opacity", 0.7);
        rightCircle.attr("opacity", 0.7);
        
        // Create a white intersection area like in the reference image
        if (centerDistance < 2 * radius) {
          // First: add a vertical ellipse for the core shape (same size as INNER join)
          g.append("ellipse")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("rx", radius * 0.55) // Same as INNER join
            .attr("ry", radius * 0.85) // Same as INNER join
            .attr("fill", "#ffffff") // White fill
            .attr("opacity", 1)
            .attr("stroke", "#e2e8f0") // Light gray stroke
            .attr("stroke-width", 1);
            
          // Second: add a horizontal ellipse to ensure corners are filled (same as INNER join)
          g.append("ellipse")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("rx", radius * 0.5) // Same as INNER join
            .attr("ry", radius * 0.5) // Same as INNER join
            .attr("fill", "#ffffff") // White fill
            .attr("opacity", 1);
        }
        break;
      case "CROSS":
        // Equal opacity for both
        leftCircle.attr("opacity", 0.7);
        rightCircle.attr("opacity", 0.7);
        break;
    }
    
    // Add labels for tables (using the display names)
    g.append("text")
      .attr("x", -centerDistance / 2 - 10)
      .attr("y", -radius - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#111827") // Dark gray/black text for light mode
      .attr("class", "dark:text-white") // Dark mode text color
      .text(leftTableDisplay); // Using the display name
    
    g.append("text")
      .attr("x", centerDistance / 2 + 10)
      .attr("y", -radius - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#111827") // Dark gray/black text for light mode
      .attr("class", "dark:text-white") // Dark mode text color
      .text(rightTableDisplay); // Using the display name
    
    // Add a legend for the join type (without row count)
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#111827") // Dark gray/black text for light mode
      .attr("class", "dark:text-white") // Dark mode text color
      .text(`${joinType} JOIN`);
      
    // Add description text
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#6b7280") // Gray text for light mode
      .attr("class", "dark:text-gray-300") // Dark mode text color
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
      case "FULL":
        return "All rows from both tables";
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