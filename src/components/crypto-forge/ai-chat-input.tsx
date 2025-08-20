
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { suggestTextForField } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { FormValues } from "@/app/types";
import type { Question } from './chat-interface';

interface AIChatInputProps {
  question: Question;
  onSubmit: (value: string) => void;
}

export function AIChatInput({ question, onSubmit }: AIChatInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const { getValues } = useFormContext<FormValues>();
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset input when question changes
    useEffect(() => {
        setInputValue('');
    }, [question]);

    // Focus input when question changes
    useEffect(() => {
        inputRef.current?.focus();
      }, [question]);

    const handleSuggest = () => {
        startTransition(async () => {
            const allFormValues = getValues();
            const suggestion = await suggestTextForField({
                fieldName: question.key,
                currentValue: allFormValues[question.key] || "",
                formContext: allFormValues,
            });

            if (suggestion.startsWith('AI suggestion failed:')) {
                toast({ variant: "destructive", title: "AI Suggestion Error", description: suggestion });
            } else {
                setInputValue(suggestion);
                toast({ title: "AI Suggestion Applied!", description: `Suggestion for ${question.label} has been filled.` });
            }
        });
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(inputValue);
    };

    return (
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
            <span className="text-primary font-bold pl-2">$</span>
            <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={question?.placeholder || "Type your answer..."}
                autoComplete="off"
            />
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0" onClick={handleSuggest} disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Get AI Suggestion</p></TooltipContent>
                </Tooltip>
             </TooltipProvider>

            <Button type="submit" variant="secondary" size="sm">Send</Button>
        </form>
    );
}

