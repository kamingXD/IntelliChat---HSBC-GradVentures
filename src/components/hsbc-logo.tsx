import { cn } from "@/lib/utils";

export function HsbcLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 40 40"
            className={cn("h-8 w-8 text-primary", className)}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="currentColor" />
            <path d="M20 5L35 20L20 35L5 20L20 5Z" fill="white" />
            <path d="M20 0L40 20L20 40L0 20L20 0Z" stroke="currentColor" strokeWidth="0.5" />
            <path d="M20 10L30 20L20 30L10 20L20 10Z" fill="currentColor" />
        </svg>
    );
}
