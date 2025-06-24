import React from "react";
import { Box, Grid, CardContent, Typography } from "@mui/material";
import { Document } from "@models/index";
import {
  StyledCard,
  DocumentIcon,
  CardOverlay,
  DocumentTitle,
  DocumentDate,
  SectionTitle,
  getEmptyStateContainerStyles,
  getEmptyStateIconStyles,
  getMainContainerStyles,
  getCardContentStyles,
  getDocumentInfoContainerStyles,
  formatDate,
  handleDocumentClick,
} from "@styles/documentStyles";

interface DocumentsProps {
  documents: Document[];
}

const Documents: React.FC<DocumentsProps> = ({ documents }) => {
  if (!documents || documents.length === 0) {
    return (
      <Box sx={getEmptyStateContainerStyles()}>
        <DocumentIcon sx={getEmptyStateIconStyles()} />
        <Typography variant="h6" color="text.secondary">
          No documents available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Documents will appear here when they are uploaded
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={getMainContainerStyles()}>
      <SectionTitle variant="h5">
        Patient Documents ({documents.length})
      </SectionTitle>

      <Grid container spacing={3}>
        {documents.map((document) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={document.id}>
            <StyledCard onClick={() => handleDocumentClick(document.url)}>
              <CardOverlay className="card-overlay" />

              <CardContent sx={getCardContentStyles()}>
                <DocumentIcon className="document-icon" />

                <Box sx={getDocumentInfoContainerStyles()}>
                  <DocumentTitle variant="h6">{document.title}</DocumentTitle>

                  <DocumentDate variant="body2">
                    {formatDate(document.date)}
                  </DocumentDate>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Documents;
