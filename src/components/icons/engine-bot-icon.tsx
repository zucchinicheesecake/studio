
import { cn } from "@/lib/utils";

interface EngineBotIconProps extends React.SVGProps<SVGSVGElement> {}

export function EngineBotIcon({ className, ...props }: EngineBotIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-6 w-6", className)}
            {...props}
        >
            <path d="M12 8V4H8L8 8H4V12H8V16H12V20H16V16H20V12H16V8Z" />
            <path d="M12 12L16 16" />
            <path d="M12 12L8 16" />
            <path d="M12 12L8 8" />
            <path d="M12 12L16 8" />
            <circle cx="12" cy="12" r="1.5" />
        </svg>
    );
}
