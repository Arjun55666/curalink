import { useState } from "react";
import Login from "./pages/Login";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Dashboard from "./pages/Dashboard";

import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  LogOut,
  Menu,
} from "lucide-react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [page, setPage] = useState("dashboard");

  //  Mobile sidebar toggle
  const [openSidebar, setOpenSidebar] = useState(false);

  if (!isLoggedIn) return <Login setIsLoggedIn={setIsLoggedIn} />;

  const menu = [
    { name: "dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "patients", icon: <Users size={18} /> },
    { name: "doctors", icon: <Stethoscope size={18} /> },
    { name: "appointments", icon: <Calendar size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">

      {/*  SIDEBAR */}
      <div
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-[#0f172a] text-white flex flex-col justify-between transform transition-transform duration-300 
        ${openSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        <div>
          <h1 className="text-2xl font-bold p-6 flex items-center gap-2">
            💊 CuraLink
          </h1>

          <div className="flex flex-col gap-2 px-3">
            {menu.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setPage(item.name);
                  setOpenSidebar(false); // close on mobile
                }}
                className={`flex items-center gap-3 px-4 py-2 rounded-md capitalize transition ${
                  page === item.name
                    ? "bg-teal-600"
                    : "hover:bg-gray-700"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* USER */}
        <div className="p-4 border-t border-gray-700">
          <p className="text-sm mb-2">Admin</p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
            }}
            className="flex items-center gap-2 text-red-400 text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      /* MAIN */
      <div className="flex-1 w-full">

        /*MOBILE HEADER */
        <div className="md:hidden bg-[#0f172a] text-white px-4 py-3 flex items-center justify-between">
          <button onClick={() => setOpenSidebar(true)}>
            <Menu />
          </button>
          <h1 className="font-semibold capitalize">{page}</h1>
        </div>

        /* DESKTOP HEADER */
        <div className="hidden md:flex bg-white px-6 py-4 shadow-sm justify-between items-center">
          <h1 className="text-xl font-semibold capitalize">{page}</h1>
        </div>

        /* CONTENT */
        <div className="p-4 md:p-6">
          {page === "dashboard" && <Dashboard />}
          {page === "patients" && <Patients />}
          {page === "doctors" && <Doctors />}
          {page === "appointments" && <Appointments />}
        </div>
      </div>
    </div>
  );
}

export default App;