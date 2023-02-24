import React from "react";
import { useState, useCallback } from "react";
import axois from "axios";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useLocation } from "react-router-dom";
// A custom hook that builds on useLocation to parse
// the query string for you.
export function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);

  const sentRequest = useCallback(async (requestConfig, dataHandler) => {
    setIsLoading(true);
    setHasError(null);

    axois({
      method: requestConfig.method ? requestConfig.method : "get",
      url: requestConfig.url,
      data: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      headers: requestConfig.headers ? requestConfig.headers : {},
    })
      .then((res) => {
        dataHandler(res);
      })
      .catch((err) => {
        setHasError(err);
      });

    setIsLoading(false);
  }, []);

  return {
    isLoading,
    hasError,
    sentRequest,
  };
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
