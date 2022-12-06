import React, { useEffect } from "react";
import useTimeout from "./useTimeout";

const useDebounce = (
  callack: any,
  delay: number | undefined,
  dependencies: any
) => {
  const { clear, reset } = useTimeout(callack, delay);
  useEffect(reset, [...dependencies, reset]);
  useEffect(clear, [clear]);
};

export default useDebounce;
