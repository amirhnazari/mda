import { Alert, AlertSeverity } from "@models/index";
import { Paper, Typography, Box, Tooltip, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import AlertMock from "@mocks/AlertMock.json";
import moment from "moment";
import { getAvatarByAlias } from "@utils/avatarMapping";

// Define a type for the raw alert from JSON to make transformation clear
interface RawAlert {
  id: string;
  title: string;
  message: string;
  room: string;
  severity: string;
  timestamp: string;
  avatarAlias: string;
}

const AlertsCard = () => {
  // To be replaced with data coming from store
  const [alerts, setAlerts] = useState<Alert | null>(null);

  useEffect(() => {
    // setAlerts(null); // Might want to load an initial alert or keep it null
  }, []);

  // This function is used to test the alert card
  const testAlert = () => {
    if (alerts) {
      setAlerts(null);
    } else {
      // Ensure AlertMock is treated as an array of RawAlert
      const rawAlerts: RawAlert[] = AlertMock as RawAlert[];
      if (rawAlerts.length === 0) return;

      const index = Math.floor(Math.random() * rawAlerts.length);
      const rawAlert = rawAlerts[index];

      // Transform rawAlert to the Alert model
      const newAlert: Alert = {
        id: rawAlert.id,
        title: rawAlert.title,
        room: rawAlert.room,
        message: rawAlert.message,
        severity: rawAlert.severity as AlertSeverity,
        timestamp: moment(rawAlert.timestamp),
        avatarAlias: rawAlert.avatarAlias,
      };

      setAlerts(newAlert);
    }
  };

  const getBorderColor = (severity: AlertSeverity): string => {
    switch (severity) {
      case AlertSeverity.Critical:
        return "red";
      case AlertSeverity.Warning:
        return "yellow";
      default:
        return "red";
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 6,
        backgroundColor: (theme) => theme.palette.background.paper,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.custom.sidebar,
          color: "#fff",
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          p: 3,
          textAlign: "center",
          cursor: "pointer",
        }}
        onClick={testAlert}
      >
        <Tooltip title="For testing purpose: Click to toggle">
          <Typography variant="h5" fontWeight="bold">
            Alerts
          </Typography>
        </Tooltip>
      </Box>
      <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column" }}>
        {alerts ? (
          <Box
            sx={{
              border: `5px solid ${getBorderColor(alerts.severity)}`,
              borderRadius: 2,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              height: "70%",
              margin: "auto 0",
            }}
          >
            <Avatar
              src={getAvatarByAlias(alerts.avatarAlias, true)}
              alt={alerts.title || alerts.message}
              sx={{ width: 56, height: 56 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" component="div" fontWeight="bold">
                {alerts.title || "Alert"}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {alerts.message}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body1" component="div" fontWeight="medium">
                {alerts.room || "N/A"}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                {alerts.timestamp.format("h:mm A")}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <HealthAndSafetyIcon
              sx={{
                fontSize: 150,
                color: (theme) => theme.palette.custom.iconPrimary,
              }}
            />
            <Typography variant="h6">No alerts</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default AlertsCard;
