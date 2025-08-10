import React from "react";
import Tooltip from '@mui/material/Tooltip';

const DivButton = ({
  children,
  onClick,
  tooltip,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tooltip?: string;
}) => {
  return (
    <>
      <Tooltip title={tooltip}>
        <div className="fake-button" onClick={onClick}>
          {children}
        </div>
      </Tooltip >
    </>
  );
};

export default DivButton;