import { createBrowserRouter } from "react-router-dom";
import { AuthPage } from "../../pages/Auth";
import { RegPage } from "../../pages/Reg";
import { DashboardPage } from "../../pages/Dashboard";
import { CreateDashboardPage } from "../../pages/CreateDashboard/CreateDashboardPage";
import { ProtectedRoute } from "../../app/providers/ProtectedRoute";

export const ENUM_LINK = {
    MAIN: '/',
    DASHBOARD: '/dashboard',
    REG: '/register',
};

export const routesConfig = createBrowserRouter([
  {
    path: ENUM_LINK.MAIN,
    element: <AuthPage />
  },
  {
    path: ENUM_LINK.REG,
    element: <RegPage />
  },
  {
    path: ENUM_LINK.DASHBOARD,
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  {
    path: `${ENUM_LINK.DASHBOARD}/:id`,
    element: (
      <ProtectedRoute>
        <CreateDashboardPage />
      </ProtectedRoute>
    )
  }
]);



