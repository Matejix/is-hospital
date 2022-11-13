import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
// Pages
import Home from "@/pages/Home";
import Recipe from "@/pages/Recipe";
import Register from "@/components/Register/Register";
import PatientService from "@/pages/PatientService";
import Schedule from "@/pages/Schedule";
import Hospitalization from "@/pages/Hospitalization";
import Requester from "@/pages/Requester";
// Components
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import Login from "@/components/Login";

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
        <Outlet />
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
    ],
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
