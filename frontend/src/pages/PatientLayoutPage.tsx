import { useState } from "react";
import { Box, Tabs, Tab, Button } from "@mui/material";
import PatientDetails from "@components/patients/PatientDetails";
import VitalSigns from "@components/patients/VitalSigns";
import MedicalConditions from "@components/patients/MedicalConditions";
import PrescriptionRecords from "@components/patients/PrescriptionRecords";
import Comments from "@components/patients/Comments";
import Documents from "@components/patients/Documents";
import { Comment } from "@models/index";
import { useParams } from "react-router-dom";
import { PatientService } from "@services/PatientService";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`patients-tabpanel-${index}`}
      aria-labelledby={`patients-tab-${index}`}
      {...other}
      sx={{ height: "100%" }}
    >
      {value === index && <Box sx={{ pt: 3, height: "100%" }}>{children}</Box>}
    </Box>
  );
}

const PatientLayoutPage = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const [value, setValue] = useState(0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>(() => {
    return patientId ? PatientService.getPatientComments(patientId) : [];
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCommentAdd = (newComment: Comment) => {
    if (patientId) {
      PatientService.addComment(patientId, newComment);
      setComments(PatientService.getPatientComments(patientId));
    }
  };

  const handleCommentDelete = (commentId: string) => {
    if (patientId) {
      PatientService.deleteComment(patientId, commentId);
      setComments(PatientService.getPatientComments(patientId));
    }
  };

  const handleCommentDone = (commentId: string) => {
    if (patientId) {
      PatientService.toggleCommentDone(patientId, commentId);
      setComments(PatientService.getPatientComments(patientId));
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
      }}
    >
      {/* Vertical Patient Info */}
      <Box
        sx={{
          flexBasis: "20%",
          height: "100%",
          minWidth: 0,
        }}
      >
        <PatientDetails />
      </Box>

      <Box
        sx={{
          p: 3,
          height: "100%",
          minWidth: 0,
          flexBasis: "80%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Patient Tabs */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs value={value} onChange={handleChange} aria-label="patient tabs">
            <Tab label="Overview" />
            <Tab label="Documents" />
          </Tabs>
          <Button variant="contained" onClick={() => setIsCommentsOpen(true)}>
            Comments
          </Button>
        </Box>
        {/* Patient Tabs Content */}
        <Box sx={{ flexGrow: 1, overflow: "hidden", p: 3 }}>
          <TabPanel value={value} index={0}>
            <Box sx={{ display: "flex", gap: 3, height: "100%" }}>
              <Box sx={{ flexBasis: "30%" }}>
                <VitalSigns />
              </Box>
              <Box
                sx={{
                  flexBasis: "70%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <MedicalConditions />
                </Box>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <PrescriptionRecords />
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Documents
              documents={
                patientId
                  ? PatientService.getPatient(patientId)?.documents || []
                  : []
              }
            />
          </TabPanel>
        </Box>
      </Box>

      <Comments
        open={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        comments={comments}
        onCommentAdd={handleCommentAdd}
        onCommentDelete={handleCommentDelete}
        onCommentDone={handleCommentDone}
      />
    </Box>
  );
};

export default PatientLayoutPage;
