import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import Dashboard from "./pages/DashboardPage";
import Patients from "./pages/PatientsPage";
import Messages from "./pages/MessagesPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients/:id?" element={<Patients />} />
            <Route path="messages" element={<Messages />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
