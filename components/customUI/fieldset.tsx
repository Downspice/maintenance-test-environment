import React from "react";
import { cn } from "@/lib/shared/utils";

// Fieldset Component
const Fieldset = ({
  legend,
  content,
  className,
}: {
  legend?: string;
  content: React.ReactNode;
  className?: string;
}) => {
  return (
    <fieldset
      className={cn(
        "border border-gray-700 rounded-xl p-3 bg-accent",
        className
      )}
    >
      <p className="text-lg font-semibold text-gray-700">{legend}</p>
      <div className="mt-2">{content}</div>
    </fieldset>
  );
};

export default Fieldset;
