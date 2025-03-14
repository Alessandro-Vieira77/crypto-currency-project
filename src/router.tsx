import { createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/home/Home";
import { Detail } from "./pages/detail/Detail";
import { NotFound } from "./pages/notFound/NotFound";
import { Layout } from "./components/layout/Layaout";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/detail/:cripto",
        element: <Detail />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export { router };
