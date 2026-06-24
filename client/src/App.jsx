import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginLanding from "./pages/LoginLanding";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payslips from "./pages/Payslips";
import Settings from "./pages/Settings";
import PrintPayslips from "./pages/PrintPayslips";
import LoginForm from "./components/LoginForm";

const App = () => {
  const loginProps = {
    role: ["admin", "employee"],
    title: ["Admin Portal", "Employee Portal"],
    subtitle: [
      "Sign in to manage the organization",
      "Sign to access your account",
    ],
  };

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginLanding />} />

        <Route
          path="/login/admin"
          element={
            <LoginForm
              role={loginProps.role[0]}
              title={loginProps.title[0]}
              subtitle={loginProps.subtitle[0]}
            />
          }
        />

        <Route
          path="/login/employee"
          element={
            <LoginForm
              role={loginProps.role[1]}
              title={loginProps.title[1]}
              subtitle={loginProps.subtitle[1]}
            />
          }
        />

        <Route element={<Layout />}>
          {" "}
          {/* side bar layout should be show below elements */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/payslips" element={<Payslips />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/print/payslips/:id" element={<PrintPayslips />} />

        <Route path="*" element={<Navigate to={"/dashboard"} replace />} />
      </Routes>
    </>
  );
};

export default App;
