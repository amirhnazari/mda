import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  LinearProgress,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useParams } from "react-router-dom";
import { Patient, VitalSign } from "@models/index";
import patientsMock from "@mocks/PatientsMock.json";
import moment from "moment";

// Import utilities
import {
  vitalConfigs,
  parseVitalValue,
  getChartSize,
  navigationArrowStyles,
  getChartContainerStyles,
  getChartTitleStyles,
  getProgressBarStyles,
  mainContainerStyles,
  contentAreaStyles,
  carouselContainerStyles,
  VitalChartConfig,
} from "@utils/vitalSignsConfig";
import {
  ChartData,
  prepareChartData,
  getChartsToDisplay,
  navigateCarousel as navigateCarouselHelper,
  handleChartClick as handleChartClickHelper,
} from "@utils/carouselHelpers";
import { drawVitalChart } from "@utils/d3ChartHelpers";

const VitalChart: React.FC<{
  data: ChartData[];
  config: VitalChartConfig;
  width: number;
  height: number;
  isExpanded?: boolean;
  isActive?: boolean;
}> = ({ data, config, width, height, isExpanded = false, isActive = true }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    drawVitalChart({ svgRef, data, config, width, height, isExpanded });
  }, [data, config, width, height, isExpanded]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{
        display: "block",
        filter: isActive ? "none" : "grayscale(100%)",
        transition: "filter 0.3s ease",
      }}
    />
  );
};

const VitalSignsVisualization: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const patient = patientsMock.find((p) => p.id === id);
    if (patient) {
      const newPatient: Patient = {
        ...patient,
        gender: patient.gender as "Male" | "Female",
        vitals: patient.vitals as VitalSign[],
        admissionDate: moment(patient.admissionDate),
        comments: patient.comments.map((c) => ({
          ...c,
          timestamp: moment(c.timestamp),
        })),
        prescriptions: patient.prescriptions,
        medicalConditions: patient.medicalConditions,
        documents: patient.documents,
      };
      setPatientData(newPatient);
      if (newPatient.vitals.length > 0) {
        setActiveIndex(0);
      }
    }
  }, [id]);

  const handleExpandChart = (vitalType: string) => {
    setExpandedChart(vitalType);
  };

  const handleCloseModal = () => {
    setExpandedChart(null);
  };

  const handleNavigation = (direction: "left" | "right") => {
    if (!patientData) return;
    const newIndex = navigateCarouselHelper(
      direction,
      activeIndex,
      patientData.vitals.length
    );
    setActiveIndex(newIndex);
  };

  if (!patientData) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6">Loading vital signs...</Typography>
      </Box>
    );
  }

  const { vitals } = patientData;
  const totalCharts = vitals.length;
  const chartsToDisplay = getChartsToDisplay(vitals, activeIndex);

  return (
    <Box sx={mainContainerStyles}>
      {/* Left Navigation */}
      <IconButton
        onClick={() => handleNavigation("left")}
        sx={{ ...navigationArrowStyles, left: 0 }}
      >
        <ChevronLeftIcon />
      </IconButton>

      {/* Main Content Area */}
      <Box sx={contentAreaStyles}>
        {/* Carousel Container */}
        <Box sx={carouselContainerStyles}>
          {chartsToDisplay.map((vital) => {
            const isCenter = vitals[activeIndex].type === vital.type;
            const config = vitalConfigs[vital.type];
            if (!config) return null;

            const chartData = prepareChartData(vital, parseVitalValue);
            const size = getChartSize(isCenter);

            return (
              <Box
                key={vital.type}
                onClick={() =>
                  handleChartClickHelper(
                    isCenter,
                    vital,
                    vitals,
                    handleExpandChart,
                    setActiveIndex
                  )
                }
                sx={getChartContainerStyles(isCenter, config)}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={getChartTitleStyles(isCenter, config)}
                >
                  {config.title}
                </Typography>
                <VitalChart
                  data={chartData}
                  config={config}
                  width={size.width}
                  height={size.height}
                  isActive={isCenter}
                />
              </Box>
            );
          })}
        </Box>

        {/* Progress Bar */}
        <Box sx={{ width: "100%", maxWidth: 350, mb: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#666",
              mb: 0.5,
              display: "block",
              fontSize: "11px",
              textAlign: "center",
            }}
          >
            {activeIndex + 1} of {totalCharts} vital signs
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(activeIndex / (totalCharts - 1)) * 100}
            sx={getProgressBarStyles(
              vitals.length > 0
                ? vitalConfigs[vitals[activeIndex].type]?.color || "#3498db"
                : "#3498db"
            )}
          />
        </Box>

        {/* Active Chart Info */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#666", fontSize: "11px" }}>
            Use arrow buttons to navigate • Click chart for details
          </Typography>
        </Box>
      </Box>

      {/* Right Navigation */}
      <IconButton
        onClick={() => handleNavigation("right")}
        sx={{ ...navigationArrowStyles, right: 0 }}
      >
        <ChevronRightIcon />
      </IconButton>

      {/* Expanded Chart Modal */}
      <Modal open={!!expandedChart} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: "none",
            maxWidth: "90vw",
            maxHeight: "90vh",
          }}
        >
          {expandedChart &&
            patientData &&
            (() => {
              const vital = patientData.vitals.find(
                (v) => v.type === expandedChart
              );
              if (!vital) return null;
              const config = vitalConfigs[expandedChart];
              const chartData = prepareChartData(vital, parseVitalValue);
              return (
                <Box>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      color: config.color,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {config.title}
                  </Typography>
                  <VitalChart
                    data={chartData}
                    config={config}
                    width={800}
                    height={400}
                    isExpanded
                  />
                </Box>
              );
            })()}
        </Box>
      </Modal>
    </Box>
  );
};

export default VitalSignsVisualization;
