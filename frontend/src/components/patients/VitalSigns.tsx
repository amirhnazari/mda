import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import patientsMock from "@mocks/PatientsMock.json";
import { VitalSign } from "@models/index";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import RespirationIcon from "@assets/icons/Raspiration_Icon.svg";
import MasksIcon from "@mui/icons-material/Masks";
import ScaleIcon from "@mui/icons-material/Scale";
import VitalSignsSeeMore from "./VitalSignsSeeMore";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

/**
 * Icon mapping for different vital sign types
 * Maps vital sign types to their corresponding MUI icons or custom SVGs
 */
const vitalSignIcons: { [key: string]: React.ReactElement } = {
  heartRate: <MonitorHeartIcon sx={{ fontSize: 35 }} />,
  bloodPressure: <ScaleIcon sx={{ fontSize: 35 }} />,
  temperature: <ThermostatIcon sx={{ fontSize: 35 }} />,
  respiration: (
    <Box
      component="img"
      src={RespirationIcon}
      alt="Respiration"
      sx={{ width: 35, height: 35 }}
    />
  ),
  oxygenSat: <MasksIcon sx={{ fontSize: 35 }} />,
};

/**
 * Human-readable names for vital sign types
 * Used for tooltips and display purposes
 */
const vitalSignNames: { [key: string]: string } = {
  heartRate: "Heart Rate",
  bloodPressure: "Blood Pressure",
  temperature: "Temperature",
  respiration: "Respiration",
  oxygenSat: "Oxygen Saturation",
};

/**
 * VitalSigns Component
 *
 * Displays patient vital signs with latest readings:
 * - Shows current vital sign values with icons
 * - Expandable modal for detailed view and historical data
 * - Tooltip information for each vital sign type
 * - Integration with VitalSignsSeeMore component for detailed analysis
 *
 * Features:
 * - Latest reading display for quick assessment
 * - Icon-based visual representation
 * - Modal dialog for expanded vital signs analysis
 * - Responsive design with proper spacing
 */
const VitalSigns = () => {
  const { id } = useParams<{ id: string }>();
  const [patientVitals, setPatientVitals] = useState<VitalSign[] | null>(null);
  const [open, setOpen] = useState(false);

  /**
   * Load patient vital signs data from mock based on URL parameter
   */
  useEffect(() => {
    const patient = patientsMock.find((p) => p.id === id);
    if (patient) {
      setPatientVitals(patient.vitals as VitalSign[]);
    }
  }, [id]);

  /**
   * Modal control functions for detailed vital signs view
   */
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        borderRadius: 6,
        backgroundColor: (theme) => theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.custom.sidebar,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "primary.contrastText" }}
        >
          Vital Signs
        </Typography>
      </Box>

      {/* Vital Signs List */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        <List>
          {patientVitals?.map((vital) => {
            // Get the most recent reading for each vital sign
            const latestReading = vital.readings[vital.readings.length - 1];
            return (
              <Tooltip
                title={vitalSignNames[vital.type]}
                placement="right"
                key={vital.type}
              >
                <ListItem sx={{ pl: 2, mb: 2 }}>
                  {/* Vital Sign Icon */}
                  <ListItemIcon sx={{ color: "custom.iconPrimary" }}>
                    {vitalSignIcons[vital.type]}
                  </ListItemIcon>

                  {/* Latest Reading Value */}
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          ml: 2,
                          fontSize: "h6.fontSize",
                          fontWeight: "medium",
                          color: "primary.main",
                        }}
                      >
                        {latestReading.value}
                      </Typography>
                    }
                  />
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* See More Button */}
      <Box sx={{ p: 2, textAlign: "right" }}>
        <Button variant="contained" onClick={handleOpen}>
          See More
        </Button>
      </Box>

      {/* Detailed View Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0 }}>
          <VitalSignsSeeMore
            onClose={handleClose}
            patientVitals={patientVitals}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default VitalSigns;
