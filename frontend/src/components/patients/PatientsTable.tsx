import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Patient, VitalSign, Comment } from "@models/index";
import patientsMock from "@mocks/PatientsMock.json";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import { useNavigate } from "react-router-dom";

/**
 * PatientsTable Component
 *
 * Data table displaying patient information with features:
 * - Sortable and filterable columns
 * - Date range filtering for admission dates
 * - Action buttons for patient detail navigation
 * - Proper data transformation and type safety
 * - Responsive table layout
 *
 * Table Features:
 * - Material React Table with advanced filtering
 * - Column filters shown by default
 * - Custom date formatting for admission dates
 * - Navigation to individual patient detail pages
 */
const PatientsTable = () => {
  /**
   * Transform and memoize patient data from mock JSON
   * Handles proper type conversion for dates, vitals, and comments
   */
  const data = useMemo<Patient[]>(
    () =>
      patientsMock.map((patient) => {
        const newPatient: Patient = {
          ...patient,
          gender: patient.gender as "Male" | "Female",
          vitals: patient.vitals as VitalSign[],
          admissionDate: moment(patient.admissionDate),
          comments: patient.comments.map((comment) => ({
            ...comment,
            timestamp: moment(comment.timestamp),
          })) as Comment[],
        };
        return newPatient;
      }),
    []
  );

  const navigate = useNavigate();

  /**
   * Column definitions for the patient data table
   * Defines headers, data accessors, filtering options, and custom renderers
   */
  const columns = useMemo<MRT_ColumnDef<Patient>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "Name",
        size: 150,
        filterVariant: "text",
      },
      {
        accessorKey: "lastName",
        header: "Family Name",
        size: 150,
        filterVariant: "text",
      },
      {
        accessorKey: "patientNumber",
        header: "Patient Num",
        size: 150,
        filterVariant: "text",
      },
      {
        accessorKey: "admissionDate",
        header: "Admission Date",
        size: 150,
        filterVariant: "date-range", // Enable date range filtering
        // Custom cell renderer for date formatting
        Cell: ({ cell }) => cell.getValue<moment.Moment>().format("DD/MM/YYYY"),
      },
      {
        accessorKey: "room",
        header: "Room Num",
        size: 100,
        filterVariant: "text",
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        // Custom action cell with navigation button
        Cell: ({ row }) => (
          <IconButton onClick={() => navigate(`/patients/${row.original.id}`)}>
            <VisibilityIcon />
          </IconButton>
        ),
        enableColumnFilter: false, // Disable filtering for action column
        enableSorting: false, // Disable sorting for action column
      },
    ],
    [navigate] // Add navigate to dependencies
  );

  /**
   * Initialize Material React Table with configuration
   * Enables advanced filtering and shows column filters by default
   */
  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnFilterModes: true, // Enable different filter modes
    initialState: { showColumnFilters: true }, // Show filters on load
  });

  return <MaterialReactTable table={table} />;
};

export default PatientsTable;
