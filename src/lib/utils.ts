import { Device } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { generateSlug } from "random-word-slugs";
import { isAndroid, isDesktop, isIOS } from "react-device-detect"; // Import from react-device-detect library [1, 2]
import { MdComputer, MdPhoneAndroid } from "react-icons/md";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type noun =
  | "profession"
  | "thing"
  | "media"
  | "people"
  | "time"
  | "transportation"
  | "place"
  | "animals"
  | "health"
  | "food"
  | "family"
  | "technology"
  | "education"
  | "business"
  | "religion"
  | "sports"
  | "science";

export const getSlug = (noun: noun) => {
  const slug = generateSlug(2, {
    format: "sentence",
    categories: { noun: [noun] },
  });

  return slug;
};

export const getUserAgent = () => {
  if (isAndroid) {
    return "ANDROID";
  }
  if (isIOS) {
    return "IOS";
  }
  if (isDesktop) {
    return "COMPUTER";
  }
};

export const iconMap = (device: Device) => {
  switch (device) {
    case "ANDROID":
      return MdPhoneAndroid;
    case "IOS":
      return MdPhoneAndroid;
    default:
      return MdComputer;
  }
};
