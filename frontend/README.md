# MEDA - Medical Dashboard App

A comprehensive healthcare management dashboard built with React, TypeScript, and Material-UI, designed to streamline medical workflows and improve patient care coordination.

## Tech Stack Overview

| Technology               | Version | Purpose                   |
| ------------------------ | ------- | ------------------------- |
| **React**                | 19.1.0  | Frontend Framework        |
| **TypeScript**           | ~5.8.3  | Type Safety & Development |
| **Vite**                 | 6.3.5   | Build Tool & Dev Server   |
| **Material-UI**          | 7.1.0   | UI Component Library      |
| **React Router**         | 7.6.0   | Client-side Routing       |
| **D3.js**                | 7.9.0   | Data Visualization        |
| **Moment.js**            | 2.30.1  | Date/Time Management      |
| **Material React Table** | 3.2.1   | Advanced Table Components |
| **Emotion**              | 11.14.0 | CSS-in-JS Styling         |
| **ESLint**               | 9.25.0  | Code Linting              |

## Overview

MEDA (Medical Dashboard App) is a modern, responsive web application that provides healthcare professionals with a centralized platform to manage patients, track vital signs, communicate with colleagues, and monitor daily activities. The app features an intuitive interface with real-time data visualization and seamless navigation between different medical workflows.

P.S. If we have a functional backend service.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   │   ├── AlertsCard.tsx
│   │   ├── DailyOverview.tsx
│   │   └── StaffOnDuty.tsx
│   ├── layout/          # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── index.tsx
│   ├── messaging/       # Messaging and communication components
│   │   ├── ChatBox.tsx
│   │   └── Inbox.tsx
│   └── patients/        # Patient management components
│       ├── PatientDetails.tsx
│       ├── VitalSigns.tsx
│       ├── MedicalConditions.tsx
│       ├── PrescriptionRecords.tsx
│       ├── Comments.tsx
│       └── Documents.tsx
├── pages/               # Main page components
│   ├── DashboardPage.tsx
│   ├── PatientsPage.tsx
│   ├── MessagesPage.tsx
│   └── PatientLayoutPage.tsx
├── services/            # Data services
│   ├── PatientService.ts
│   └── MessageService.ts
├── models/              # TypeScript interfaces
│   ├── patient.ts
│   ├── message.ts
│   └── dashboard.ts
├── mocks/               # Mock data for development
│   ├── PatientsMock.json
│   ├── MessagesMock.json
│   ├── AlertMock.json
│   └── StaffOnDutyMock.json
├── styles/              # Global and component-specific styles
│   ├── commentsStyles.ts
│   ├── documentStyles.ts
│   └── messagingStyles.ts
├── utils/               # Utility functions
│   ├── avatarMapping.ts
│   ├── vitalSignsConfig.ts
│   └── d3ChartHelpers.ts
├── theme/               # Material-UI theme configuration
└── assets/              # Static assets (images, icons)
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- yarn package manager

### Installation

1. **Navigate to frontend directory**

```bash
cd mda/frontend
```

2. **Install dependencies**

```bash
yarn install
```

3. **Start the development server**

```bash
yarn dev
```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
yarn build
```

## Usage

Once the application is running, you can access the Medical Dashboard App through your web browser. Here's how to navigate and use the main features:

## Dashboard Navigation

- **Home Page**: Access the main dashboard at `http://localhost:5173`
- **Sidebar Navigation**: Use the left sidebar to switch between the main sections:

  - Dashboard (dashboard icon)
  - Patients (person search icon)
  - Messages (message icon)

- **Daily Overview**: Scrollable section showing the tasks and appointments for the day. The view auto-scrolls to the next upcoming item and visually highlights it with a background color.  
  _(The next appointment appears slightly highlighted when the page loads.)_

- **Alerts (Mock Function)**: Click the "Alerts" button to simulate system alerts. Each click toggles between no alerts and a randomly selected alert type.

- **Alert Types**:

  - **Critical (red)** – Urgent medical situations
  - **Warning (yellow)** – Important but non-critical notifications

- **Staff on Duty**: Displays staff members currently on shift. Use the search field to find someone, then click "Send Message" to open the chat. You'll be redirected to the "Messages" page with the conversation for that person automatically selected.

- **Back Navigation**: Use the back arrow in the sidebar to return to the previous page.

- **User Profile Avatar**: The avatar icon in the top right corner includes a logout option (mock only – no authentication implemented). It also displays a red badge showing the number of unread messages.

## Patient Management

1. **View All Patients**: Click "Patients" in the sidebar to access the patient list.
2. **Search & Filter**: Use the built-in search and filter tools to find specific patients. Each column offers different filtering modes and can be hidden or shown individually.
3. **Patient Details**: Click the "eye" icon in any row to view the patient's profile, which shows detailed information about the selected patient.
4. **Patient Profile Navigation**:
   - Switch between "Contact" and "Details" tabs in the left sidebar.
   - Use the **visibility toggle** (eye icon) to blur or reveal sensitive patient information.
5. **Patient Records**: Switch between the "Overview" and "Documents" tabs:

   - **Overview**: Displays vital signs, medical conditions, and prescriptions.
   - **Documents**: Shows all uploaded documents, sorted by date.

6. **Vital Signs Monitoring (<u>See More</u> section)**

- **Quick View**: Summary of the most recent vital signs in the overview tab.
- **Detailed Analysis**: Click "See More" to access:
  - Data tables showing values from the last 7 days
  - Interactive D3.js charts (click to expand for detailed view)
  - Toggle switch to alternate between table and visualization modes
- **Monitored Parameters**: Heart rate, blood pressure, temperature, respiration, oxygen saturation

7. **Patient Comments**

- Click the "Comments" button in the patient profile to:
  - Leave new comments for the selected patient
  - Review notes left by other staff
  - Delete comments after the delete confirmation
  - Flag comments as "Done"

## Messaging Features

1. **Inbox**:

   - View all incoming messages
   - Unread messages are marked with a blue indicator (In the form of a small dot)
   - Delete messages using the trash icon after confirmation

2. **Staff Messaging**:

   - Go to the "Messages" section
   - Use the autocomplete dropdown menu to select a staff member
   - Start a conversation directly
   - Use the back arrow within the messaging view to return to the staff selection list and choose a different colleague

3. **Quick Contact**: Message staff directly from the "Staff on Duty" widget (see: Dashboard Navigation → Staff on Duty)

## Tips for Effective Usage

- Use filters and search to locate patients quickly
- Keep the dashboard open for live alerts and current staff info
- Monitor your inbox to stay updated on team communication
- Use comments to document patient care
- Adjust visibility settings depending on your environment

## Data Management

The app uses a service-based architecture for data management:

- **PatientService**: Handles all patient-related data operations
- **MessageService**: Manages communication data and chat functionality
- **Mock Data**: Comprehensive mock datasets for development and testing

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build
- `yarn lint` - Run ESLint
- `yarn preview` - Preview build

## Division of work

1. **Dashboard**

- **DailyOverview**: Amir
- **Alert Card**: Kevin
- **StaffOnDuty**: Amir and Kevin

2. **Patient Management**

- **Patients Table**: Kevin
- **PatientDetails**: Amir
- **VitalSigns**: Amir and Kevin
  - **VitalSigns Table**: Kevin
  - **VitalSigns Visualization**: Amir
- **MedicalConditions**: Kevin
- **PrescriptionRecords**: Amir and Kevin
- **Documents**: Amir
- **Comments**: Amir, Lihn and Khan

3. **Messaging System**

- **Inbox**: Amir and Khan
- **ChatBox**: Kevin and Lihn
- **Notification Indicator**: Amir, Kevin, Lihn and Khan

4. **Application Configuration**

- **Layout, hierarchy, themes and models**: Amir
