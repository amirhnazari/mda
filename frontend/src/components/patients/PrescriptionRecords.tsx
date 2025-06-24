import { Paper, Typography, Box, Tooltip } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Patient, PrescriptionRecord, VitalSign } from "@models/index";
import patientsMock from "@mocks/PatientsMock.json";
import moment from "moment";

interface MedicationStatus {
  color: "green" | "yellow" | "red";
  tooltip: string;
}

// Define medication categories - in a real app this would come from a database
const getMedicationStatus = (
  prescription: PrescriptionRecord
): MedicationStatus => {
  // Check if prescription is older than 3 months
  const prescriptionDate = moment()
    .month(prescription.month)
    .year(moment().year());
  const threeMonthsAgo = moment().subtract(3, "months");
  const isOlderThan3Months = prescriptionDate.isBefore(threeMonthsAgo);

  // Green: Receipt-free medications
  if (prescription.receiptFree) {
    return {
      color: "green",
      tooltip: "This medicine doesn't need a receipt.",
    };
  }

  // Red: Not receipt-free AND older than 3 months
  if (!prescription.receiptFree && isOlderThan3Months) {
    return {
      color: "red",
      tooltip:
        "This prescription is older than 3 months. Patient needs to visit a doctor for a new receipt.",
    };
  }

  // Yellow: Not receipt-free but within last 3 months
  if (!prescription.receiptFree && !isOlderThan3Months) {
    return {
      color: "yellow",
      tooltip:
        "Patient can receive a new receipt as long as it's not older than 3 months.",
    };
  }

  // Fallback (should not reach here)
  return {
    color: "red",
    tooltip:
      "Patient needs to visit a doctor to receive a receipt for this medicine.",
  };
};

const getStatusCircleColor = (color: "green" | "yellow" | "red") => {
  switch (color) {
    case "green":
      return "#4CAF50";
    case "yellow":
      return "#FFC107";
    case "red":
      return "#F44336";
    default:
      return "#9E9E9E";
  }
};

const PrescriptionRecords = () => {
  const { id } = useParams<{ id: string }>();
  const [patientData, setPatientData] = useState<Patient | null>(null);

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
    }
  }, [id]);

  // Get current month and last 2 months
  const currentMonth = moment().format("MMMM");
  const lastMonth = moment().subtract(1, "month").format("MMMM");
  const twoMonthsAgo = moment().subtract(2, "months").format("MMMM");

  const months = [twoMonthsAgo, lastMonth, currentMonth];

  // Group prescriptions by month
  const prescriptionsByMonth =
    patientData?.prescriptions.reduce((acc, prescription) => {
      const month = prescription.month;
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(prescription);
      return acc;
    }, {} as Record<string, PrescriptionRecord[]>) || {};

  // Get all unique medications across all months to create consistent rows
  const allMedications = Array.from(
    new Set(patientData?.prescriptions.map((p) => p.medication) || [])
  );

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
          Prescription Records
        </Typography>
      </Box>

      <Box sx={{ flex: 1, pb: 3, px: 3, mt: 3, overflowY: "auto" }}>
        {/* Header Row */}
        <Box
          sx={{
            display: "flex",
            mb: 2,
            pb: 1,
            borderBottom: "2px solid #e0e0e0",
            position: "sticky",
            top: 0,
            backgroundColor: (theme) => theme.palette.background.paper,
            zIndex: 1,
            pt: 0,
          }}
        >
          <Box sx={{ flex: "0 0 25%", pr: 1 }}>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ color: "text.secondary" }}
            >
              Medication
            </Typography>
          </Box>
          {months.map((month) => (
            <Box key={month} sx={{ flex: "0 0 25%", textAlign: "center" }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ color: "text.secondary" }}
              >
                {month}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Prescription Rows */}
        {allMedications.map((medication) => {
          // Find any prescription for this medication to determine status
          const anyPrescription = patientData?.prescriptions.find(
            (p) => p.medication === medication
          );
          const status = anyPrescription
            ? getMedicationStatus(anyPrescription)
            : { color: "red" as const, tooltip: "No prescription found" };

          return (
            <Box
              key={medication}
              sx={{
                display: "flex",
                alignItems: "center",
                py: 1.5,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Box
                sx={{
                  flex: "0 0 25%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  pr: 1,
                }}
              >
                <Tooltip title={status.tooltip} arrow>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: getStatusCircleColor(status.color),
                      cursor: "help",
                      flexShrink: 0,
                    }}
                  />
                </Tooltip>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {medication}
                </Typography>
              </Box>

              {months.map((month) => {
                const prescriptionsForMonth = prescriptionsByMonth[month] || [];
                const medicationForMonth = prescriptionsForMonth.find(
                  (p) => p.medication === medication
                );

                return (
                  <Box
                    key={`${medication}-${month}`}
                    sx={{ flex: "0 0 25%", textAlign: "center" }}
                  >
                    {medicationForMonth ? (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary" }}
                      >
                        {medicationForMonth.dosage}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.disabled" }}
                      >
                        -
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          );
        })}

        {allMedications.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              No prescription records found
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default PrescriptionRecords;
