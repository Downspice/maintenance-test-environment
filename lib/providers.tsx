"use client";

import { ReactNode } from "react";
 import { ProgressProvider } from '@bprogress/next/app';

export function Providers({ children }: { children: ReactNode }) {
 

  return (
    <ProgressProvider
      height="4px"
      color="#55b2c9"
      options={{ showSpinner: true }}
      shallowRouting >
        {children} 
    </ProgressProvider>
  );
}
