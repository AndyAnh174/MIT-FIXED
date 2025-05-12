import { useAppState } from "context";

function ProtectedComponent({ children, requiredRole }) {
  const [user] = useAppState("user");

  if (requiredRole && user?.role !== requiredRole) return null;
  return children;
}

export default ProtectedComponent;
