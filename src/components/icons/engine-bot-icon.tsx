
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
            {/* Main Head Shape */}
            <rect x="4" y="4" width="16" height="16" rx="2" />
            
            {/* Eye Sockets */}
            <circle cx="9.5" cy="11.5" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="14.5" cy="11.5" r="1.5" fill="currentColor" stroke="none" />
            
            {/* Mouth Grill */}
            <line x1="8" y1="16" x2="16" y2="16" />
            <line x1="8" y1="18" x2="16" y2="18" />

            {/* Forehead Gear */}
            <path d="M12 4V2M12 2L13.5 3.5M12 2L10.5 3.5" />
            <circle cx="12" cy="7" r="1" />

             {/* Smoke Animation */}
             <style>
                {`
                    @keyframes smoke {
                        0% { transform: translateY(0) scale(1); opacity: 0.8; }
                        50% { transform: translateY(-10px) scale(1.2); opacity: 0.4; }
                        100% { transform: translateY(-20px) scale(1.5); opacity: 0; }
                    }
                    .smoke-1 { animation: smoke 3s linear infinite; }
                    .smoke-2 { animation: smoke 3s linear 1s infinite; }
                `}
            </style>
            
            {/* Smoke Puffs */}
            <path d="M18 6 Q 19 5 20 6" className="smoke-1" strokeWidth="1" />
            <path d="M18 9 Q 19 8 20 9" className="smoke-2" strokeWidth="1"/>

        </svg>
    );
}

