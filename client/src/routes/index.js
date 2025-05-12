import { Route, Routes } from "react-router-dom";
import { RouteComponent } from "./constants";
import ProtectedComponent from "./ProtectedComponent";

const route = () => {
  return (
    <Routes>
      {Object.values(RouteComponent).map(
        ({ element, requiredRole, ...props }) => (
          <Route
            key={props.path}
            {...props}
            element={
              <ProtectedComponent requiredRole={requiredRole}>
                {element}
              </ProtectedComponent>
            }
          />
        ),
      )}
    </Routes>
  );
};

export default route;
