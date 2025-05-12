import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axiosClient from "./axiosClient";

export const useApi = (url, method) => {
  const unMounted = useRef(false);
  const [pending, setPending] = useState(false);
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    return () => (unMounted.current = true);
  }, []);

  const resData = useMemo(
    () => ({ pending, data, error }),
    [data, error, pending],
  );

  const fetch = useCallback(
    body => {
      setPending(true);
      axiosClient
        .request({ url, method, data: body })
        .then(res => {
          if (!unMounted) {
            setData(res);
            setPending(false);
          }
        })
        .catch(err => {
          if (!unMounted) {
            setError(err);
            setPending(false);
          }
        });
    },
    [method, url],
  );

  const clear = useCallback(() => {
    if (!unMounted) {
      setError(undefined);
      setData(undefined);
    }
  }, []);

  return [resData, fetch, clear];
};
