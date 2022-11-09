import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
// Pages
import Home from "@/pages/Home";
import Medicaments from "@/pages/Medicaments";
// Components
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import Login from "@/components/Login";
import Register from "@/components/Register/Register";

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
        <Footer />
      </>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "medicaments",
        element: <Medicaments />,
      },
    ],
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
