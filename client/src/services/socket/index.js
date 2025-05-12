import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("", {
  withCredentials: true,
});

export const useSocket = key => {
  const [state, setState] = useState(undefined);

  const handle = payload => {
    setState(payload);
  };

  useEffect(() => {
    socket.on(key, handle);

    return () => {
      socket.off(key, handle);
    };
  }, [key]);

  const emit = useCallback((emitKey, payload) => {
    socket.emit(emitKey, payload);
  }, []);

  return [state, emit];
};

export default socket;
