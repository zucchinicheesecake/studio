
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import { Loader2, Sparkles, Undo2, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { suggestTextForField } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { FormValues } from "@/app/types";

interface AIInputProps<T extends FieldValues> extends TextareaProps {
  name: Path<T>;
  label: string;
}

export function AIInput<T extends FieldValues>({ name, label, ...props }: AIInputProps<T>) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { setValue, getValues, watch } = useFormContext<FormValues>();
  const currentValue = watch(name);
  
  // Ref to store the value before AI suggestion
  const previousValue = useRef(currentValue);

  // Update previousValue ref whenever the currentValue changes from an external source
  useEffect(() => {
    previousValue.current = currentValue;
  }, [currentValue]);


  const handleSuggest = () => {
    startTransition(async () => {
        previousValue.current = getValues(name); // Save current value before suggesting
        const allFormValues = getValues();
        const suggestion = await suggestTextForField({
            fieldName: name,
            currentValue: allFormValues[name] || "",
            formContext: allFormValues,
        });

        if (suggestion.startsWith('AI suggestion failed:')) {
            toast({ variant: "destructive", title: "AI Suggestion Error", description: suggestion });
        } else {
            setValue(name, suggestion, { shouldValidate: true, shouldDirty: true });
            toast({ title: "AI Suggestion Applied!", description: `The ${label} has been updated.` });
        }
    });
  };

  const handleUndo = () => {
    setValue(name, previousValue.current, { shouldValidate: true, shouldDirty: true });
  };

  const handleClear = () => {
    previousValue.current = getValues(name); // allow undoing a clear
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="relative">
      <Textarea {...props} />
      <TooltipProvider>
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={handleSuggest} disabled={isPending}>
                        {isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>AI Suggest {currentValue ? "Improvement" : ""}</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={handleUndo} disabled={currentValue === previousValue.current}>
                        <Undo2 />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Undo</p></TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={handleClear} disabled={!currentValue}>
                        <X />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Clear</p></TooltipContent>
            </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
