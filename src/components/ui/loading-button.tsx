"use client";
import { BiLoader } from "react-icons/bi";
import { Button, ButtonProps } from "./button";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const LoadingButton = ({
  children,
  isLoading = false,
  className,
  variant,
  size,
  asChild = false,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      disabled={isLoading}
      className={className}
      variant={variant}
      size={size}
      asChild={asChild}
      {...props}
    >
      {isLoading ? <BiLoader className="animate-spin" /> : children}
    </Button>
  );
};
