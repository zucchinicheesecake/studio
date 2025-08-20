
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useExplanation } from "@/hooks/use-explanation";
import { HelpCircle } from "lucide-react";

interface LabelWithExplainProps {
    label: string;
    concept: string;
}

export function LabelWithExplain({ label, concept }: LabelWithExplainProps) {
    const { handleExplain } = useExplanation();
    return (
        <div className="flex items-center justify-between mb-2">
            <Label>{label}</Label>
            <Button
                type="button" // important to prevent form submission
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => handleExplain(concept)}
            >
                <HelpCircle className="mr-1 h-3 w-3" />
                What is this?
            </Button>
        </div>
    )
}
