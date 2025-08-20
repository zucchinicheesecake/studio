
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LabelWithExplain } from "./label-with-explain";
import { AIInput } from "./ai-input";

export function Step6Community() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Community & Growth</CardTitle>
        <CardDescription>Outline your strategy for building and engaging your community.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="communityStrategy"
          render={({ field }) => (
            <FormItem>
              <LabelWithExplain label="Community Building Strategy" concept="Community Strategy" />
              <FormControl>
                <AIInput
                  label="Community Building Strategy"
                  placeholder="How will you attract and retain users and contributors? (e.g., Hackathons, content marketing, social media engagement, ambassador programs)."
                  className="resize-y min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
