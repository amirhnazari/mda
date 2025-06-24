import PatientsTable from "@components/patients/PatientsTable";
import PatientLayoutPage from "@pages/PatientLayoutPage";
import { Box, Stack } from "@mui/material";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useParams } from "react-router-dom";
import moment from "moment";

moment.locale("de");

const Patients: React.FC = () => {
  const { id } = useParams() as { id: string };
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="de">
      {id ? (
        <PatientLayoutPage id={id} />
      ) : (
        <Box sx={{ height: "100%" }}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%" }}
          >
            <PatientsTable />
          </Stack>
        </Box>
      )}
    </LocalizationProvider>
  );
};

export default Patients;
