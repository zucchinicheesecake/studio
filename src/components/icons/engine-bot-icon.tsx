
import { cn } from "@/lib/utils";

interface EngineBotIconProps extends React.SVGProps<SVGSVGElement> {}

export function EngineBotIcon({ className, ...props }: EngineBotIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-6 w-6", className)}
            {...props}
        >
            <style>
                {`
                    .smoke {
                        animation: smoke 4s infinite ease-out;
                        transform-origin: 18px 8px;
                    }
                    .smoke-1 { animation-delay: 0s; }
                    .smoke-2 { animation-delay: 1s; }
                    .smoke-3 { animation-delay: 2s; }

                    @keyframes smoke {
                        0% { transform: translateY(0) scale(1); opacity: 1; }
                        50% { transform: translateY(-10px) scale(1.2); opacity: 0.5; }
                        100% { transform: translateY(-20px) scale(1.5); opacity: 0; }
                    }
                `}
            </style>
            <path d="M12 8V4H8L8 8H4V12H8V16H12V20H16V16H20V12H16V8Z" />
            <path d="M12 12L16 16" />
            <path d="M12 12L8 16" />
            <path d="M12 12L8 8" />
            <path d="M12 12L16 8" />
            <circle cx="12" cy="12" r="1.5" />
            
            {/* Smoke animation paths */}
            <path className="smoke smoke-1" d="M18 8c1.1 0 2 .9 2 2s-.9 2-2 2" strokeWidth="1" />
            <path className="smoke smoke-2" d="M18 8c1.1 0 2 .9 2 2s-.9 2-2 2" strokeWidth="1" />
            <path className="smoke smoke-3" d="M18 8c1.1 0 2 .9 2 2s-.9 2-2 2" strokeWidth="1" />
        </svg>
    );
}
