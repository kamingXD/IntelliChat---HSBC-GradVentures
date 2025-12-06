import { cn } from "@/lib/utils";
import Image from "next/image";

export function HsbcLogo({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {

  if (iconOnly) {
    return (
      <div className={cn("relative h-8 w-8 text-primary", className)}>
        <Image
          src="/hsbc-logo-2.png"
          alt="HSBC Icon"
          fill
          sizes="32px"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative h-8 w-24", className)}>
       <Image
        src="/hsbc-logo-2.png"
        alt="HSBC Logo"
        fill
        sizes="96px"
        className="object-contain"
      />
    </div>
  );
}
