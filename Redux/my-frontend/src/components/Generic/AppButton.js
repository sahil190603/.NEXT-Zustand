import React from "react";
import { Button, Tooltip } from "@mui/material"; 
import PropTypes from "prop-types";

const AppButton = ({ 
  label, 
  icon, 
  onClick, 
  tooltip, 
  danger = false, 
  color = "default", 
  style = {}, 
  variant = "text" 
}) => {
  return (
    <Tooltip title={tooltip}>
      <span> 
        <Button
          onClick={onClick}
          variant={variant} 
          color={danger ? "error" : color} 
          style={style}
          startIcon={icon} 
        >
          {label}
        </Button>
      </span>
    </Tooltip>
  );
};

AppButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node, 
  onClick: PropTypes.func.isRequired,
  tooltip: PropTypes.string.isRequired,
  danger: PropTypes.bool,
  color: PropTypes.string,
  style: PropTypes.object,
  variant: PropTypes.string,
};

export default AppButton;