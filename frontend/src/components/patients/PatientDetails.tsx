import React, { useState, useEffect } from "react";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import WcIcon from "@mui/icons-material/Wc";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import TagIcon from "@mui/icons-material/Tag";
import ArticleIcon from "@mui/icons-material/Article";
import BedIcon from "@mui/icons-material/Bed";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonIcon from "@mui/icons-material/Person";
import patientsMock from "@mocks/PatientsMock.json";
import { useParams } from "react-router-dom";
import { Patient, VitalSign, Comment } from "@models/index";
import moment from "moment";
import { getAvatarByAlias } from "@utils/avatarMapping";

/**
 * PatientDetails Component
 *
 * Displays comprehensive patient information with privacy controls:
 * - Patient avatar and basic identification
 * - Privacy blur toggle for sensitive information
 * - Tabbed interface for contact and medical details
 * - Icon-based information display with tooltips
 * - Responsive layout with proper data handling
 *
 * Privacy Features:
 * - Toggle blur effect on sensitive patient data
 * - Visual feedback for data visibility state
 */

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patientData, setPatientData] = useState<Patient | null>(null);

  // Privacy control - blur sensitive information by default
  const [isBlurred, setIsBlurred] = useState(true);

  // Tab navigation state
  const [selectedTab, setSelectedTab] = useState("contact");

  /**
   * Load and transform patient data from mock based on URL parameter
   * Handles proper type conversion for dates and nested objects
   */
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
        })) as Comment[],
        prescriptions: patient.prescriptions,
        medicalConditions: patient.medicalConditions,
        documents: patient.documents,
      };
      setPatientData(newPatient);
    } else {
      setPatientData(null);
    }
  }, [id]);

  /**
   * Toggle privacy blur effect on sensitive patient information
   */
  const toggleBlur = () => {
    setIsBlurred(!isBlurred);
  };

  /**
   * CSS styles for blur effect with smooth transition
   */
  const blurredTextStyle = {
    filter: isBlurred ? "blur(4px)" : "none",
    transition: "filter 0.3s ease-in-out",
  };

  /**
   * Handle tab switching between contact and details views
   */
  const handleTabChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTab: string | null
  ) => {
    if (newTab !== null) {
      setSelectedTab(newTab);
    }
  };

  // Handle case where patient is not found
  if (!patientData) {
    return (
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          overflow: "auto",
        }}
      >
        <Typography variant="h6">Patient not found</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        overflow: "auto",
      }}
    >
      {/* Patient Avatar */}
      <Avatar
        src={getAvatarByAlias(patientData.avatarAlias, true)}
        alt={patientData.firstName}
        sx={{ width: 160, height: 160, my: 3 }}
      >
        {patientData.avatarAlias}
      </Avatar>

      {/* Privacy Toggle Button */}
      <IconButton sx={{ mb: 2 }} onClick={toggleBlur}>
        {isBlurred ? (
          <VisibilityOffIcon
            fontSize="large"
            sx={{ color: "custom.iconPrimary" }}
          />
        ) : (
          <VisibilityIcon
            fontSize="large"
            sx={{ color: "custom.iconPrimary" }}
          />
        )}
      </IconButton>

      {/* Tab Navigation */}
      <ToggleButtonGroup
        value={selectedTab}
        exclusive
        onChange={handleTabChange}
        aria-label="Contact details"
        sx={{ mb: 2 }}
        size="small"
      >
        <ToggleButton
          value="contact"
          aria-label="contact"
          sx={{
            backgroundColor:
              selectedTab === "contact" ? "primary.main" : "inherit",
            color:
              selectedTab === "contact" ? "primary.contrastText" : "inherit",
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "primary.contrastText",
            },
            "&.Mui-selected:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          Contact
        </ToggleButton>
        <ToggleButton
          value="details"
          aria-label="details"
          sx={{
            backgroundColor:
              selectedTab === "details" ? "primary.main" : "inherit",
            color:
              selectedTab === "details" ? "primary.contrastText" : "inherit",
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "primary.contrastText",
            },
            "&.Mui-selected:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          Details
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Contact Information Tab */}
      {selectedTab === "contact" && (
        <List sx={{ width: "100%", px: 2 }}>
          <Tooltip title="Name" placement="right">
            <ListItem>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <PersonIcon sx={{ color: "custom.iconPrimary" }} />
              </ListItemIcon>
              <ListItemText
                primary={`${patientData.firstName} ${patientData.lastName}`}
                sx={blurredTextStyle}
              />
            </ListItem>
          </Tooltip>
          <Tooltip title="Phone" placement="right">
            <ListItem>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <PhoneIcon sx={{ color: "custom.iconPrimary" }} />
              </ListItemIcon>
              <ListItemText
                primary={patientData.contact.phone}
                sx={blurredTextStyle}
              />
            </ListItem>
          </Tooltip>
          <Tooltip title="Email" placement="right">
            <ListItem>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <EmailIcon sx={{ color: "custom.iconPrimary" }} />
              </ListItemIcon>
              <ListItemText
                primary={patientData.contact.email}
                sx={blurredTextStyle}
              />
            </ListItem>
          </Tooltip>
          <Tooltip title="Address" placement="right">
            <ListItem>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <LocationOnIcon sx={{ color: "custom.iconPrimary" }} />
              </ListItemIcon>
              <ListItemText
                primary={patientData.contact.address}
                sx={blurredTextStyle}
              />
            </ListItem>
          </Tooltip>
        </List>
      )}

      {/* Medical Details Tab */}
      {selectedTab === "details" && (
        <List sx={{ width: "100%", px: 2 }}>
          <Tooltip title="Age" placement="right">
            <ListItem>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <DirectionsRunIcon sx={{ color: "custom.iconPrimary" }} />
              </ListItemIcon>
              <ListItemText primary={patientData.age} sx={blurredTextStyle} />
            </ListItem>
          </Tooltip>
          <Tooltip title="Gender" placement="right">
            <ListItem>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <WcIcon sx={{ color: "custom.iconPrimary" }} />
              </ListItemIcon>
              <ListItemText
                primary={patientData.gender}
                sx={blurredTextStyle}
              />
            </ListItem>
          </Tooltip>
          <Tooltip title="Blood Type" placement="right">
            <ListItem>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <BloodtypeIcon sx={{ color: "custom.iconPrimary" }} />
              </ListItemIcon>
              <ListItemText
                primary={patientData.bloodType}
                sx={blurredTextStyle}
              />
            </ListItem>
          </Tooltip>
          <Tooltip title="Patient Number" placement="right">
            <ListItem>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <TagIcon sx={{ color: "custom.iconPrimary" }} />
              </ListItemIcon>
              <ListItemText
                primary={patientData.patientNumber}
                sx={blurredTextStyle}
              />
            </ListItem>
          </Tooltip>
          <Tooltip title="Admission Date" placement="right">
            <ListItem>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <ArticleIcon sx={{ color: "custom.iconPrimary" }} />
              </ListItemIcon>
              <ListItemText
                primary={moment(patientData.admissionDate).format("DD.MM.YYYY")}
                sx={blurredTextStyle}
              />
            </ListItem>
          </Tooltip>
          <Tooltip title="Bed Number" placement="right">
            <ListItem>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <BedIcon sx={{ color: "custom.iconPrimary" }} />
              </ListItemIcon>
              <ListItemText primary={patientData.room} sx={blurredTextStyle} />
            </ListItem>
          </Tooltip>
          <Tooltip title="Attending Physician" placement="right">
            <ListItem>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <MedicalServicesIcon sx={{ color: "custom.iconPrimary" }} />
              </ListItemIcon>
              <ListItemText
                primary={patientData.doctorName}
                sx={blurredTextStyle}
              />
            </ListItem>
          </Tooltip>
        </List>
      )}
    </Paper>
  );
};

export default PatientDetails;
