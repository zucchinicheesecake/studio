
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LabelWithExplain } from "./label-with-explain";
import { AIInput } from "./ai-input";


export function Step2TargetAudience() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Target Audience</CardTitle>
        <CardDescription>Who are you building this for? Be specific. The AI will use this to tailor your strategy.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <LabelWithExplain label="Audience Profile" concept="Target Audience" />
              <FormControl>
                <AIInput
                  label="Audience Profile"
                  placeholder="e.g., DeFi power users who are frustrated with high gas fees. Or, artists and creators who want to monetize their work through NFTs."
                  className="resize-y h-36"
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
