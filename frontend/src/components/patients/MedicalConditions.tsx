import { Paper, Typography, Box, Chip, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import patientsMock from "@mocks/PatientsMock.json";
import { MedicalCondition } from "@models/index";

/**
 * MedicalConditions Component
 *
 * Displays a patient's medical conditions in a structured format:
 * - Loads patient data based on URL parameter
 * - Shows condition names as chips with explanations
 * - Responsive layout with proper spacing
 * - Visual separation between conditions using dividers
 *
 * Layout Features:
 * - Fixed-width condition chips for consistency
 * - Scrollable content area for long condition lists
 * - Professional medical information presentation
 */
const MedicalConditions = () => {
  const { id } = useParams<{ id: string }>();
  const [patientConditions, setPatientConditions] = useState<
    MedicalCondition[] | null
  >(null);

  /**
   * Load patient medical conditions from mock data
   * Filters patient by ID from URL parameters
   */
  useEffect(() => {
    const patient = patientsMock.find((p) => p.id === id);
    if (patient) {
      setPatientConditions(patient.medicalConditions as MedicalCondition[]);
    }
  }, [id]);

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
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff" }}>
          Medical Conditions
        </Typography>
      </Box>

      {/* Medical Conditions List */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          ml: 4,
          overflowY: "auto",
        }}
      >
        {patientConditions?.map((condition, index) => (
          <Box key={condition.name}>
            {/* Individual Condition Row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                my: 1.5,
              }}
            >
              {/* Condition Name Chip */}
              <Box sx={{ minWidth: 320, flexShrink: 0 }}>
                <Chip
                  label={condition.name}
                  sx={{
                    fontSize: "body2.fontSize",
                    flexShrink: 0,
                  }}
                />
              </Box>

              {/* Condition Explanation */}
              <Typography variant="body2">
                {condition.shortExplanation}
              </Typography>
            </Box>

            {/* Divider between conditions (except for last item) */}
            {index < patientConditions.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default MedicalConditions;
