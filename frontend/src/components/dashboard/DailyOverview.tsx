import { Paper, Typography, Box, Avatar, Stack } from "@mui/material";
import { useState, useEffect, useRef, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { OverviewItem, EventType } from "@models/index";
import moment from "moment";
import OverviewItemsMock from "@mocks/OverviewItemsMock.json";
import { getAvatarByAlias } from "@utils/avatarMapping";

/**
 * DailyOverview Component
 *
 * Displays a list of scheduled events/tasks for the day with automatic scrolling
 * to highlight the next upcoming task. The component handles:
 * - Loading and transforming mock data into proper types
 * - Automatically scrolling to the next upcoming task
 * - Highlighting the current/next task with a background color
 */
const DailyOverview = () => {
  const navigate = useNavigate();
  const [overviewItems, setOverviewItems] = useState<OverviewItem[]>([]);
  const [upcomingTaskIndex, setUpcomingTaskIndex] = useState<number>(-1);

  // Refs for managing scrolling behavior to individual items
  const itemRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Transform mock data and initialize refs when component mounts
  useEffect(() => {
    const transformedItems = OverviewItemsMock.map((item) => ({
      ...item,
      event: item.event as EventType,
      time: moment(item.time),
      patient: {
        ...item.patient,
        firstName: item.patient.firstName,
        lastName: item.patient.lastName,
      },
    }));

    // Create refs for each item to enable scrolling to specific items
    const newRefs = transformedItems.map(
      (_, i) => itemRefs.current[i] ?? createRef<HTMLDivElement>()
    );
    itemRefs.current = newRefs;
    setOverviewItems(transformedItems as OverviewItem[]);
  }, []);

  /**
   * Auto-scroll logic: Find and highlight the next upcoming task
   * Uses mock date with current time to simulate real-time behavior
   */
  useEffect(() => {
    if (overviewItems.length === 0 || !scrollContainerRef.current) return;

    // Use the mock date but with current time for realistic simulation
    const mockDateString = overviewItems[0].time.format("YYYY-MM-DD");
    const currentTimeString = moment().format("HH:mm:ss");
    const now = moment(`${mockDateString}T${currentTimeString}`);

    let nextUpcomingTaskIndex = -1;
    let smallestDiff = Infinity;

    // Find the next task after current time
    for (let i = 0; i < overviewItems.length; i++) {
      const itemTime = overviewItems[i].time;
      if (itemTime.isAfter(now)) {
        const diff = itemTime.diff(now);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          nextUpcomingTaskIndex = i;
        }
      }
    }

    // Fallback: If no future tasks found, find the most recent past task
    if (nextUpcomingTaskIndex === -1 && overviewItems.length > 0) {
      let closestPastTaskIndex = -1;
      let smallestPastDiff = Infinity;

      for (let i = 0; i < overviewItems.length; i++) {
        const itemTime = overviewItems[i].time;
        if (itemTime.isBefore(now)) {
          const diff = now.diff(itemTime);
          if (diff < smallestPastDiff) {
            smallestPastDiff = diff;
            closestPastTaskIndex = i;
          }
        }
      }

      if (closestPastTaskIndex !== -1) {
        nextUpcomingTaskIndex = closestPastTaskIndex;
      } else if (overviewItems.length > 0) {
        // Final fallback: just use the first item
        nextUpcomingTaskIndex = 0;
      }
    }

    setUpcomingTaskIndex(nextUpcomingTaskIndex);

    // Smooth scroll to the highlighted task
    if (
      nextUpcomingTaskIndex !== -1 &&
      itemRefs.current[nextUpcomingTaskIndex]?.current
    ) {
      itemRefs.current[nextUpcomingTaskIndex].current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [overviewItems]);

  /**
   * Handle patient name click - navigate to patient details
   */
  const handlePatientClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 6,
        backgroundColor: (theme) => theme.palette.background.paper,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.custom.sidebar,
          color: "#fff",
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          p: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h5">Daily Overview</Typography>
      </Box>

      {/* Scrollable content area */}
      <Box ref={scrollContainerRef} sx={{ flex: 1, m: 3, overflowY: "auto" }}>
        <Stack spacing={2}>
          {overviewItems.map((item, index) => (
            <Box
              key={item.id}
              ref={itemRefs.current[index]}
              sx={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 150px 100px",
                alignItems: "center",
                gap: 2,
                // Highlight the upcoming/current task with background color
                backgroundColor:
                  index === upcomingTaskIndex ? "#E2DEF6" : "transparent",
                padding: 2,
                borderRadius: 2,
              }}
            >
              {/* Patient avatar */}
              <Avatar
                alt={`${item.patient.firstName} ${item.patient.lastName}`}
                src={getAvatarByAlias(item.patient.avatarAlias)}
                sx={{ width: 80, height: 80 }}
              />

              {/* Patient name and event details */}
              <Box>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  onClick={() => handlePatientClick(item.patient.id)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      color: "primary.main",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {item.patient.gender === "Male" ? "Mr." : "Ms."}{" "}
                  {`${item.patient.firstName} ${item.patient.lastName}`}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {item.event}
                </Typography>
              </Box>

              {/* Scheduled time */}
              <Typography variant="body1" sx={{ textAlign: "left", ml: 8 }}>
                {item.time.format("HH:mm")}
              </Typography>

              {/* Room number */}
              <Typography variant="body1">{item.room}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

export default DailyOverview;
