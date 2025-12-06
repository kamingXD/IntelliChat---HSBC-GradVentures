import { cn } from "@/lib/utils";

export function HsbcLogo({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  const hexagonIcon = (
    <svg
      viewBox="0 0 40 40"
      className="h-full w-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="currentColor" />
      <path d="M20 5L35 20L20 35L5 20L20 5Z" fill="white" />
      <path
        d="M20 0L40 20L20 40L0 20L20 0Z"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <path d="M20 10L30 20L20 30L10 20L20 10Z" fill="currentColor" />
    </svg>
  );

  if (iconOnly) {
    return (
      <div className={cn("h-8 w-8 text-primary", className)}>
        {hexagonIcon}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 h-8", className)}>
      <svg
        viewBox="0 0 100 40"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0H8.333V16.667H25V0H33.333V40H25V23.333H8.333V40H0V0Z" fill="#262626"/>
        <path d="M41.667 0H75V8.333H56.667V15.833H70V24.167H56.667V31.667H75V40H41.667V0Z" fill="#262626"/>
        <path d="M83.333 0H91.667L100 20L91.667 40H83.333L91.667 20L83.333 0Z" fill="#DB0011"/>
      </svg>
      <div className="h-full w-auto text-primary">{hexagonIcon}</div>
    </div>
  );
}
