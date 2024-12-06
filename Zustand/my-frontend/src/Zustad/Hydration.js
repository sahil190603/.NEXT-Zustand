"use client";

import * as React from "react";
import useAppThemeStore from "./Store";

const Hydration = () => {
  React.useEffect(() => {
    const unsubscribe = useAppThemeStore.persist.onRehydrateStorage?.(() => {
      console.log("State has been rehydrated.");
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  return null;
};

export default Hydration;
