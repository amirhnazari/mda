import { Moment } from "moment";
import { PatientShort } from "@models/index";
export interface StaffMember {
  id: string;
  name: string;
  role: "Nurse" | "Dr." | "NP." | "PA.";
  avatarAlias: string;
}

export enum AlertSeverity {
  Warning = "warning",
  Critical = "critical",
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  room: string;
  severity: AlertSeverity;
  timestamp: Moment;
  avatarAlias: string;
}

export enum EventType {
  BloodCheck = "Blood Check",
  PatientFollowUp = "Patient Follow-up",
  ReviewXRays = "Review X-Rays",
  MedicationReview = "Medication Review",
  LabResults = "Lab Results",
  ImagingResults = "Imaging Results",
  Procedure = "Procedure",
  Consultation = "Consultation",
  ThyoidSurgery = "Thyoid Surgery",
  PatientAdmission = "Patient Admission",
  Surgery = "Surgery",
}

export interface OverviewItem {
  id: string;
  event: EventType;
  room: string;
  time: Moment;
  patient: PatientShort;
}

export interface PrescriptionRecord {
  id: string;
  medication: string;
  dosage: string;
  month: string;
  receiptFree: boolean;
}

export interface VitalSign {
  type:
    | "oxygenSat"
    | "respiration"
    | "temperature"
    | "bloodPressure"
    | "heartRate";
  readings: { day: string; value: string }[];
}
