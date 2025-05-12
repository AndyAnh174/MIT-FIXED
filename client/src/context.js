import { Map } from "immutable";
import {
  useState,
  useMemo,
  useContext,
  useCallback,
  createContext,
} from "react";

const AppContext = createContext();

export const useAppState = key => {
  const [appState, setAppState] = useContext(AppContext);
  const state = useMemo(() => appState?.get(key), [appState, key]);
  const setState = useCallback(
    newState => setAppState?.(key, newState),
    [key, setAppState],
  );

  return [state, setState];
};

export const AppProvider = props => {
  const [state, setState] = useState(Map());

  const setValue = useCallback((key, newValue) => {
    setState(cur =>
      cur.set(
        key,
        typeof newValue === "function"
          ? newValue(cur.get(key))
          : newValue,
      ),
    );
  }, []);

  const contextValue = useMemo(
    () => [state, setValue, setState],
    [setValue, state],
  );

  return <AppContext.Provider {...props} value={contextValue} />;
};
