import {
  Paper,
  Typography,
  Box,
  Avatar,
  Stack,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StaffMember } from "@models/index";
import StaffOnDutyMock from "@mocks/StaffOnDutyMock.json";
import { getAvatarByAlias } from "@utils/avatarMapping";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MessageIcon from "@mui/icons-material/Message";

/**
 * StaffOnDuty Component
 *
 * Displays a list of staff members currently on duty with functionality to:
 * - Search through staff members by name
 * - Navigate to messaging interface for direct communication
 * - Toggle between search and normal view
 */
const StaffOnDuty = () => {
  const navigate = useNavigate();

  // Staff data management
  const [allStaffList, setAllStaffList] = useState<StaffMember[]>([]);
  const [displayedStaffList, setDisplayedStaffList] = useState<StaffMember[]>(
    []
  );

  // Search functionality state
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Load initial staff data from mock
  useEffect(() => {
    setAllStaffList(StaffOnDutyMock as StaffMember[]);
    setDisplayedStaffList(StaffOnDutyMock as StaffMember[]);
  }, []);

  /**
   * Filter staff list based on search term
   * Updates displayed list whenever search term or original data changes
   */
  useEffect(() => {
    if (searchTerm === "") {
      setDisplayedStaffList(allStaffList);
    } else {
      setDisplayedStaffList(
        allStaffList.filter((staff) =>
          staff.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, allStaffList]);

  /**
   * Toggle search input visibility and clear search when closing
   */
  const handleSearchToggle = () => {
    if (showSearchInput) {
      setSearchTerm(""); // Clear search term when closing
    }
    setShowSearchInput(!showSearchInput);
  };

  /**
   * Navigate to messages page with pre-selected staff member
   * This allows for direct messaging with the selected staff member
   */
  const handleMessageClick = (staff: StaffMember) => {
    navigate("/messages", {
      state: {
        preSelectedStaff: {
          id: staff.id,
          name: staff.name,
          role: staff.role,
          avatarAlias: staff.avatarAlias,
        },
      },
    });
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
      {/* Dynamic header - shows search input or title based on state */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: (theme) => theme.palette.custom.sidebar,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          p: 2,
        }}
      >
        {showSearchInput ? (
          // Search input field with custom styling for dark background
          <TextField
            fullWidth
            variant="standard"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            autoFocus
            sx={{
              mx: 5,
              input: { color: "white" },
              "& .MuiInput-underline:before": {
                borderBottomColor: "rgba(255, 255, 255, 0.7)",
              },
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                borderBottomColor: "white",
              },
              "& .MuiInput-underline:after": { borderBottomColor: "white" },
              "& .MuiPlaceholder-root": { color: "rgba(255, 255, 255, 0.7)" },
            }}
          />
        ) : (
          // Default title
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff" }}>
            Staff on Duty
          </Typography>
        )}

        {/* Search toggle button - positioned absolutely for consistent layout */}
        <IconButton
          onClick={handleSearchToggle}
          sx={{
            color: "#fff",
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {showSearchInput ? <CloseIcon /> : <SearchIcon />}
        </IconButton>
      </Box>

      {/* Staff list - scrollable content area */}
      <Box sx={{ flex: 1, m: 3, overflowY: "auto" }}>
        <Stack spacing={2}>
          {displayedStaffList.map((staff) => (
            <Box
              key={staff.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 60px",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Staff member avatar */}
              <Avatar
                alt={staff.name}
                src={getAvatarByAlias(staff.avatarAlias, false)} // Pass false for isPatient
                sx={{ width: 60, height: 60 }}
              />

              {/* Staff member details */}
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {staff.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {staff.role}
                </Typography>
              </Box>

              {/* Message button - opens messaging interface */}
              <Tooltip title="Send a message">
                <IconButton
                  color="primary"
                  onClick={() => handleMessageClick(staff)}
                >
                  <MessageIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

export default StaffOnDuty;
