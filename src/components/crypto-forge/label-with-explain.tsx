
"use client";

import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { useExplanation } from "@/app/forge/page";
import { HelpCircle } from "lucide-react";

interface LabelWithExplainProps {
    label: string;
    concept: string;
}

export function LabelWithExplain({ label, concept }: LabelWithExplainProps) {
    const { handleExplain } = useExplanation();
    return (
        <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            <Button
                type="button" // important to prevent form submission
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-xs"
                onClick={() => handleExplain(concept)}
            >
                <HelpCircle className="mr-1 h-3 w-3" />
                Explain
            </Button>
        </div>
    )
}
