import { Moment } from "moment";
import { PrescriptionRecord, VitalSign } from "./dashboard";

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface Document {
  id: string;
  title: string;
  url: string;
  date: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Moment;
  avatarAlias: string;
  done: boolean;
}

export interface PatientShort {
  id: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female";
  age: number;
  avatarAlias: string;
}

export interface MedicalCondition {
  name: string;
  shortExplanation: string;
}

export interface Patient extends PatientShort {
  patientNumber: string;
  bloodType: string;
  admissionDate: Moment;
  room: string;
  doctorName: string;
  contact: ContactInfo;
  prescriptions: PrescriptionRecord[];
  medicalConditions: MedicalCondition[];
  vitals: VitalSign[];
  documents: Document[];
  comments: Comment[];
}
