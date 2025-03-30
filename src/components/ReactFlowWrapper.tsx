"use client";

import { ReactNode } from "react";
import { ReactFlowProvider } from "reactflow";

interface ReactFlowWrapperProps {
  children: ReactNode;
}

const ReactFlowWrapper = ({ children }: ReactFlowWrapperProps) => {
  return (
    <ReactFlowProvider>
      <div className="react-flow-wrapper" style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </ReactFlowProvider>
  );
};

export default ReactFlowWrapper; 