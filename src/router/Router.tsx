import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "@/pages/Home";
import Medicaments from "@/pages/Medicaments";

import Menu from "@/components/Menu";
import Footer from "@/components/Footer";

const router = createBrowserRouter([
  {
    path: "/",
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
