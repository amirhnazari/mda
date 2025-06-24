import { SxProps, Theme } from "@mui/material";

export interface VitalChartConfig {
  type: string;
  title: string;
  color: string;
  yAxisLabel: string;
}

export const vitalConfigs: Record<string, VitalChartConfig> = {
  heartRate: {
    type: "heartRate",
    title: "Heart Rate",
    color: "#e74c3c",
    yAxisLabel: "BPM",
  },
  bloodPressure: {
    type: "bloodPressure",
    title: "Blood Pressure",
    color: "#3498db",
    yAxisLabel: "mmHg",
  },
  temperature: {
    type: "temperature",
    title: "Temperature",
    color: "#f39c12",
    yAxisLabel: "°C",
  },
  oxygenSat: {
    type: "oxygenSat",
    title: "Oxygen Saturation",
    color: "#2ecc71",
    yAxisLabel: "%",
  },
  respiration: {
    type: "respiration",
    title: "Respiration Rate",
    color: "#9b59b6",
    yAxisLabel: "breaths/min",
  },
};

export const parseVitalValue = (value: string, type: string): number => {
  switch (type) {
    case "heartRate":
      return parseInt(value.replace(" bpm", ""));
    case "bloodPressure":
      return parseInt(value.split("/")[0]);
    case "temperature":
      return parseFloat(value.replace(" °C", ""));
    case "oxygenSat":
      return parseInt(value.replace("%", ""));
    case "respiration":
      return parseInt(value.replace(" breaths/min", ""));
    default:
      return 0;
  }
};

export const getChartSize = (isCenter: boolean) => {
  return isCenter ? { width: 280, height: 140 } : { width: 200, height: 100 };
};

// Navigation arrow styles
export const navigationArrowStyles: SxProps<Theme> = {
  position: "absolute",
  top: "calc(50% - 40px)",
  transform: "translateY(-50%)",
  zIndex: 10,
  background: "linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)",
  color: "white",
  width: 44,
  height: 44,
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  "&:hover": {
    background: "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",
    transform: "translateY(-50%) scale(1.1)",
  },
};

// Chart container styles
export const getChartContainerStyles = (
  isCenter: boolean,
  config: VitalChartConfig
): SxProps<Theme> => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  transform: isCenter ? "scale(1)" : "scale(0.85)",
  opacity: isCenter ? 1 : 0.6,
  border: isCenter ? `2px solid ${config.color}` : "1px solid #e0e0e0",
  borderRadius: 3,
  p: 1,
  backgroundColor: isCenter ? "#ffffff" : "#fafafa",
  boxShadow: isCenter
    ? `0 6px 16px ${config.color}33`
    : "0 2px 6px rgba(0,0,0,0.05)",
  "&:hover": {
    transform: isCenter ? "scale(1.03)" : "scale(0.9)",
  },
});

// Chart title styles
export const getChartTitleStyles = (
  isCenter: boolean,
  config: VitalChartConfig
): SxProps<Theme> => ({
  color: isCenter ? config.color : "#777",
  fontWeight: isCenter ? "bold" : "normal",
  textAlign: "center",
  fontSize: isCenter ? "14px" : "11px",
  transition: "all 0.3s ease",
  mb: 0.5,
});

// Progress bar styles
export const getProgressBarStyles = (color: string): SxProps<Theme> => ({
  height: 4,
  borderRadius: 2,
  "& .MuiLinearProgress-bar": {
    backgroundColor: color,
  },
});

// Main container styles
export const mainContainerStyles: SxProps<Theme> = {
  p: 1,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
};

export const contentAreaStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

export const carouselContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  height: 180,
  mb: 2,
};
