
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LabelWithExplain } from "./label-with-explain";
import { AIInput } from "./ai-input";

export function Step5Distribution() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Token Distribution</CardTitle>
        <CardDescription>Plan how your tokens will be allocated to different stakeholders.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="initialDistribution"
          render={({ field }) => (
            <FormItem>
              <LabelWithExplain label="Initial Distribution Plan" concept="Token Distribution" />
              <FormControl>
                <AIInput
                  label="Initial Distribution Plan"
                  placeholder="How will the tokens be allocated at launch? (e.g., 50% to the community treasury, 20% to the team (vested), 20% to early investors, 10% for an airdrop)."
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
