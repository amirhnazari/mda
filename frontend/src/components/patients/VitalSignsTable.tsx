import { useMemo } from "react";
import {
  MRT_Table,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { VitalSign } from "@models/index";

const vitalTypeToColumn: Record<string, string> = {
  heartRate: "Heart Rate",
  bloodPressure: "Blood Pressure",
  temperature: "Temperature",
  oxygenSat: "Saturation",
  respiration: "Respiration",
};

interface VitalSignsTableProps {
  patientVitals: VitalSign[];
}

interface TableRow {
  Date: string;
  "Heart Rate"?: string;
  "Blood Pressure"?: string;
  Temperature?: string;
  Saturation?: string;
  Respiration?: string;
}

const VitalSignsTable = ({ patientVitals }: VitalSignsTableProps) => {
  // Build a table where each row is a day, and each column is a vital type
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const data: TableRow[] = useMemo(() => {
    if (!patientVitals) return [];
    // For each day, build a row with all vital types
    return days.map((day) => {
      const row: TableRow = { Date: day };
      patientVitals.forEach((vital: VitalSign) => {
        const reading = vital.readings.find(
          (r: { day: string; value: string }) => r.day === day
        );
        if (reading) {
          const columnKey = vitalTypeToColumn[vital.type] as keyof TableRow;
          row[columnKey] = reading.value;
        }
      });
      return row;
    });
  }, [patientVitals]);

  const columns = useMemo<MRT_ColumnDef<TableRow>[]>(
    () => [
      { accessorKey: "Date", header: "Date" },
      { accessorKey: "Heart Rate", header: "Heart Rate" },
      { accessorKey: "Blood Pressure", header: "Blood Pressure" },
      { accessorKey: "Temperature", header: "Temperature" },
      { accessorKey: "Saturation", header: "Saturation" },
      { accessorKey: "Respiration", header: "Respiration" },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableKeyboardShortcuts: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    mrtTheme: (theme) => ({
      baseBackgroundColor: theme.palette.background.default,
    }),
    muiTableBodyRowProps: { hover: false },
    muiTableProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
        caption: {
          captionSide: "top",
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
        fontStyle: "italic",
        fontWeight: "normal",
        minWidth: 80,
        maxWidth: 120,
        padding: "4px 8px",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
        minWidth: 80,
        maxWidth: 120,
        padding: "4px 4px",
      },
    },
    renderCaption: () => `Vital signs for last 7 days.`,
  });

  return <MRT_Table table={table} />;
};

export default VitalSignsTable;
