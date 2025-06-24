import { Comment } from "@models/index";
import patientsMock from "@mocks/PatientsMock.json";
import moment from "moment";

interface RawComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatarAlias?: string;
  done: boolean;
}

// In a real application, this would be API calls to a backend
export class PatientService {
  private static patientsData = [...patientsMock];

  static getPatientComments(patientId: string): Comment[] {
    const patient = this.patientsData.find((p) => p.id === patientId);
    if (!patient) return [];

    return patient.comments.map((comment: RawComment) => ({
      id: comment.id,
      author: comment.author,
      content: comment.content,
      timestamp: moment(comment.timestamp),
      avatarAlias:
        comment.avatarAlias ||
        comment.author.toLowerCase().replace(/[. ]/g, "-"),
      done: comment.done,
    }));
  }

  static addComment(patientId: string, comment: Comment): void {
    const patient = this.patientsData.find((p) => p.id === patientId);
    if (patient) {
      (patient.comments as RawComment[]).push({
        id: comment.id,
        author: comment.author,
        content: comment.content,
        timestamp: comment.timestamp.toISOString(),
        avatarAlias: comment.avatarAlias,
        done: comment.done,
      });
    }
  }

  static deleteComment(patientId: string, commentId: string): void {
    const patient = this.patientsData.find((p) => p.id === patientId);
    if (patient) {
      patient.comments = patient.comments.filter(
        (comment) => comment.id !== commentId
      );
    }
  }

  static toggleCommentDone(patientId: string, commentId: string): void {
    const patient = this.patientsData.find((p) => p.id === patientId);
    if (patient) {
      const comment = patient.comments.find((c) => c.id === commentId);
      if (comment) {
        comment.done = !comment.done;
      }
    }
  }

  static getPatient(patientId: string) {
    return this.patientsData.find((p) => p.id === patientId);
  }
}
