// Import staff avatars
import lauraAvatar from "@avatars/staff/dr-laura-moertel.webp";
import michaelAvatar from "@avatars/staff/dr-michael-rabb.webp";
import mehrdadAvatar from "@avatars/staff/nurse-mehrdad-pishbar.webp";
import taniaAvatar from "@avatars/staff/nurse-tania-guzman.webp";
import arronAvatar from "@avatars/staff/np-arron-kewel.webp";
import elenaAvatar from "@avatars/staff/pa-elena-ramos.webp";
import userAvatar from "@avatars/staff/user.webp";
import staffFallback from "@avatars/staff/staff-fallback.webp";

// Import patient avatars
import lenaAvatar from "@avatars/patients/lena-mueller.webp";
import marcusAvatar from "@avatars/patients/marcus-malik.webp";
import noahAvatar from "@avatars/patients/noah-perrati.webp";
import oanhAvatar from "@avatars/patients/oanh-nguyen.webp";
import vladislovAvatar from "@avatars/patients/vladislov-ilyov.webp";
import patientFallback from "@avatars/patients/patient-fallback.webp";
import frejaAvatar from "@avatars/patients/freja-lindstroem.webp";
import bedAvatar from "@avatars/patients/hospital-bed.webp";

// Avatar mapping for staff and patients
export const avatarMap: Record<string, string> = {
  // Staff
  "dr-laura-moertel": lauraAvatar,
  "dr-michael-rabb": michaelAvatar,
  "nurse-mehrdad-pishbar": mehrdadAvatar,
  "nurse-tania-guzman": taniaAvatar,
  "np-arron-kewel": arronAvatar,
  "pa-elena-ramos": elenaAvatar,
  "user-avatar": userAvatar,

  // Patients
  "lena-mueller": lenaAvatar,
  "marcus-malik": marcusAvatar,
  "noah-perrati": noahAvatar,
  "oanh-nguyen": oanhAvatar,
  "vladislov-ilyov": vladislovAvatar,
  "hospital-bed": bedAvatar,
  "freja-lindstroem": frejaAvatar,

  // Fallbacks
  "staff-fallback": staffFallback,
  "patient-fallback": patientFallback,
};

// Helper function to get avatar by alias with fallback
// Pass false to get staff avatar fallback and true to get patient avatar fallback
export const getAvatarByAlias = (alias: string, isPatient = true): string => {
  return avatarMap[alias] || (isPatient ? patientFallback : staffFallback);
};
