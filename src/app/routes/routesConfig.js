import { createBrowserRouter } from "react-router";
import { AuthPage } from "../../pages/Auth";
import { RegPage } from "../../pages/Reg";
import { DashboardPage } from "../../pages/Dashboard";
import { CreateDashboardPage } from "../../pages/CreateDashboard";
import { ProtectedRoute } from "../../app/providers/ProtectedRoute";

export const routesConfig = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />
  },
  {
    path: "/register",
    element: <RegPage />
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/dashboard/:id",
    element: (
      <ProtectedRoute>
        <CreateDashboardPage />
      </ProtectedRoute>
    )
  }
]);