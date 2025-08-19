"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProgressProvider } from '@bprogress/next/app';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ProgressProvider
      height="4px"
      color="#55b2c9"
      options={{ showSpinner: true }}
      shallowRouting
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ProgressProvider>
  );
}
