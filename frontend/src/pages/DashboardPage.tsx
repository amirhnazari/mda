import { Box } from "@mui/material";
import DailyOverview from "@components/dashboard/DailyOverview";
import AlertsCard from "@components/dashboard/AlertsCard";
import StaffOnDuty from "@components/dashboard/StaffOnDuty";

const Dashboard: React.FC = () => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        gap: 3,
        p: 6,
      }}
    >
      {/* Daily Overview */}
      <Box sx={{ flexBasis: "60%", height: "100%", minWidth: 0 }}>
        <DailyOverview />
      </Box>

      {/* Alerts and Staff on Duty */}
      <Box
        sx={{
          flexBasis: "40%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          minWidth: 0,
        }}
      >
        <AlertsCard />
        <StaffOnDuty />
      </Box>
    </Box>
  );
};

export default Dashboard;
