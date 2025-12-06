import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-8 w-8", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 0L37.3205 10V30L20 40L2.67949 30V10L20 0Z"
        fill="currentColor"
        className="text-primary/20"
      />
      <path
        d="M20 4L35.5885 12.25V27.75L20 36L4.41154 27.75V12.25L20 4Z"
        fill="currentColor"
        className="text-primary"
      />
      <path d="M4 12L20 21L36 12" stroke="hsl(var(--primary-foreground))" strokeWidth="2" />
      <path d="M20 36V21" stroke="hsl(var(--primary-foreground))" strokeWidth="2" />
    </svg>
  );
}
