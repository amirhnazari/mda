import { styled } from "@mui/material/styles";
import { Box, Card, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { SxProps, Theme } from "@mui/material";

// Styled Components
export const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: "16px",
  border: "1px solid",
  borderColor: theme.palette.grey[200],
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",

  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    borderColor: theme.palette.primary.main,

    "& .document-icon": {
      transform: "scale(1.1) rotate(5deg)",
      color: theme.palette.primary.main,
    },

    "& .card-overlay": {
      opacity: 1,
    },
  },
}));

export const DocumentIcon = styled(DescriptionIcon)(({ theme }) => ({
  fontSize: "3rem",
  color: theme.palette.grey[400],
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  marginBottom: theme.spacing(2),
}));

export const CardOverlay = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)",
  opacity: 0,
  transition: "opacity 0.3s ease",
  pointerEvents: "none",
}));

export const DocumentTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
  lineHeight: 1.3,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}));

export const DocumentDate = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  fontWeight: 500,
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  position: "relative",

  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-8px",
    left: 0,
    width: "60px",
    height: "3px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    borderRadius: "2px",
  },
}));

// Inline Styles
export const getEmptyStateContainerStyles = (): SxProps<Theme> => ({
  p: 3,
  textAlign: "center",
});

export const getEmptyStateIconStyles = (): SxProps<Theme> => ({
  fontSize: "4rem",
  color: "grey.300",
  mb: 2,
});

export const getMainContainerStyles = (): SxProps<Theme> => ({
  p: 3,
});

export const getCardContentStyles = (): SxProps<Theme> => ({
  p: 3,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
  zIndex: 1,
});

export const getDocumentInfoContainerStyles = (): SxProps<Theme> => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
});

// Helper Functions
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getAssetUrl = (url: string): string => {
  // Convert the mock URL to the correct Vite asset URL
  if (url.includes("frontend/src/assets/patientDocs/dummy.pdf")) {
    return "/src/assets/patientDocs/dummy.pdf";
  }
  return url;
};

export const handleDocumentClick = (url: string): void => {
  // Open PDF in a new browser tab
  const assetUrl = getAssetUrl(url);
  window.open(assetUrl, "_blank", "noopener,noreferrer");
};
