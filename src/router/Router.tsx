import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Axios from "axios";
// Pages
import Home from "@/pages/Home";
import Recipe from "@/pages/Recipe";
import Register from "@/components/Register/Register";
import PatientService from "@/pages/PatientService";
import Schedule from "@/pages/Schedule";
import Hospitalization from "@/pages/Hospitalization";
import Requester from "@/pages/Requester";
import Profile from "@/pages/Profile";
import Reports from "@/pages/Reports";
import DataModel from "@/pages/DataModel";

// Reports
import Report1 from "@/pages/Reports/Report1";
import Report2 from "@/pages/Reports/Report2";
import Report3 from "@/pages/Reports/Report3";
import Report4 from "@/pages/Reports/Report4";
import Report5 from "@/pages/Reports/Report5";
import Report6 from "@/pages/Reports/Report6";
import Report7 from "@/pages/Reports/Report7";
import Report8 from "@/pages/Reports/Report8";
import Report9 from "@/pages/Reports/Report9";
import Report10 from "@/pages/Reports/Report10";
import Report11 from "@/pages/Reports/Report11";
import Report12 from "@/pages/Reports/Report12";

// Components
import Menu from "@/components/Menu";
import Login from "@/components/Login";
import Bubble from "@/components/CornerBubbles";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Login />
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <Register />
      </>
    ),
  },
  {
    path: "/app",
    element: (
      <>
        <Menu />
        <div className="pl-24">
          <Outlet />
          <Bubble />
        </div>
      </>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "recipe",
        element: <Recipe />,
      },
      {
        path: "patient-service",
        element: <PatientService />,
      },
      {
        path: "schedule",
        element: <Schedule />,
      },
      {
        path: "hospitalization",
        element: <Hospitalization />,
      },
      {
        path: "requester",
        element: <Requester />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      // {
      //   path: "reports",
      //   element: (
      //     <>
      //       <div className="flex">
      //         <Reports />
      //         <Outlet />
      //       </div>
      //     </>
      //   ),
      //   children: [
      //     { path: "report-1", element: <Report1 /> },
      //     { path: "report-2", element: <Report2 /> },
      //     { path: "report-3", element: <Report3 /> },
      //     { path: "report-4", element: <Report4 /> },
      //     { path: "report-5", element: <Report5 /> },
      //     { path: "report-6", element: <Report6 /> },
      //     { path: "report-7", element: <Report7 /> },
      //     { path: "report-8", element: <Report8 /> },
      //     { path: "report-9", element: <Report9 /> },
      //     { path: "report-10", element: <Report10 /> },
      //     { path: "report-11", element: <Report11 /> },
      //     { path: "report-12", element: <Report12 /> },
      //   ],
      // },
      {
        path: "data-model",
        element: <DataModel />,
      },
    ],
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
