import { cn } from "@/lib/utils";
import React from "react";
import { Input } from "./input";
import { Label } from "./label";

type Props = {
  name: string;
  label: string;
  defaultValue?: string | undefined;
  error?: string;
  id: string;
  disabled?: boolean;
  hidden?: boolean;
};

export const InputWithLabel = ({
  name,
  id,
  label,
  defaultValue,
  error,
  disabled = false,
}: Props) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        defaultValue={defaultValue}
        className={cn(
          disabled && "bg-gray-200 cursor-not-allowed pointer-events-none"
        )}
      />
      {error && <span className="text-red-500 font-semibold">{error}</span>}
    </div>
  );
};
