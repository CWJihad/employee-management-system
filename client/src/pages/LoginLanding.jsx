import React from "react";
import LoginLeftSide from "../components/LoginLeftSide";
import { ArrowRight, Copyright, ShieldIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

const LoginLanding = () => {
  const portalOptions = [
    {
      to: "/login/admin",
      title: "Admin Portal",
      description:
        "Manage employees, departments, payroll and system configurations.",
      icon: ShieldIcon,
    },
    {
      to: "/login/employee",
      title: "Employee Portal",
      description:
        "View your profile, track attendance, request time off and access payslips.",
      icon: UserIcon,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto min-h-screen">

        <div className="w-full max-w-md animate-fade-in relative z-10">
            
          <header className="mb-10 text-center md:text-left">
            <h2 className="text-slate-900 font-medium text-3xl mb-3 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500">
              Select your portal to securely access the system.
            </p>
          </header>

          <main className="space-y-4">
            {portalOptions.map((portal) => (
              <Link
                key={portal.to}
                to={portal.to}
                className="group block bg-slate-50 border border-slate-200 rounded-lg p-5 sm:p-6 transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50"
              >
                <div className="relative z-10 flex items-center justify-between gap-4 sm:gap-5 text-lg text-slate-800 group-hover:text-indigo-600 mb-1 transition-colors">
                    <h3 className="">{portal.title}</h3>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </main>

          <footer className="mt-12 text-center md:text-left text-sm text-slate-400 flex items-center space-x-1">
            <Copyright className="w-3 h-3"/>
            <p> {new Date().getFullYear()} CWJihad. All rights reserved</p>
          </footer>
        </div>

      </div>

    </div>
  );
};

export default LoginLanding;
