import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

function PrivateRoute({ children }) {
  const location = useLocation();
  const tokenInLocalStorage = localStorage.getItem("token");

  const tokenInCookie = Cookies.get("token");

  const isAuthenticated = tokenInLocalStorage || tokenInCookie;

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
}
export default PrivateRoute;