"use client";

import { ReactNode } from "react";
import { ReactFlowProvider } from "reactflow";

interface ReactFlowWrapperProps {
  children: ReactNode;
}

const ReactFlowWrapper = ({ children }: ReactFlowWrapperProps) => {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
};

export default ReactFlowWrapper; 