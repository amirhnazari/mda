import { Box, Switch, Paper, Button, Typography } from "@mui/material";
import { useState } from "react";
import VitalSignsTable from "./VitalSignsTable";
import VitalSignsVisualization from "./VitalSignsVisualization";
import { VitalSign } from "@models/index";

interface VitalSignsSeeMoreProps {
  patientVitals: VitalSign[] | null;
  onClose: () => void;
}

/**
 * VitalSignsSeeMore Component
 *
 * Modal content component that provides two different views of vital signs data:
 * 1. Table View - Structured tabular display of vital signs over time
 * 2. Visualization View - Interactive charts and graphs for trend analysis
 *
 * Features:
 * - Toggle switch to alternate between view modes
 * - Consistent modal layout and actions
 * - Fixed height container with scrollable content
 * - Close button to dismiss the modal
 *
 * Integration:
 * - Uses VitalSignsTable for tabular data presentation
 * - Uses VitalSignsVisualization for graphical analysis
 */
const VitalSignsSeeMore = ({
  patientVitals,
  onClose,
}: VitalSignsSeeMoreProps) => {
  // Toggle state: false = table view, true = visualization view
  const [visualize, setVisualize] = useState(false);

  return (
    <Paper sx={{ height: 600, display: "flex", flexDirection: "column" }}>
      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Conditional rendering based on view mode */}
        {!visualize ? (
          // Table View - Structured data display
          <VitalSignsTable patientVitals={patientVitals || []} />
        ) : (
          // Visualization View - Charts and graphs
          <Box sx={{ width: "100%", height: "100%", mt: 6 }}>
            <VitalSignsVisualization />
          </Box>
        )}
      </Box>

      {/* Control Panel - View Toggle and Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        {/* View Toggle Switch */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>Table</Typography>
          <Switch
            checked={visualize}
            onChange={() => setVisualize((v) => !v)}
          />
          <Typography>Visualization</Typography>
        </Box>

        {/* Close Modal Button */}
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Paper>
  );
};

export default VitalSignsSeeMore;
