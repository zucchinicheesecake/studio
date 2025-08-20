
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIInput } from "./ai-input";
import { LabelWithExplain } from "./label-with-explain";

export function Step4DistributionCommunity() {
  const { control } = useFormContext();

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Distribution & Community</CardTitle>
        <CardDescription>Plan how you'll allocate your tokens and grow your community.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
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
                  className="resize-y h-28"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="communityStrategy"
          render={({ field }) => (
            <FormItem>
              <LabelWithExplain label="Community Growth Strategy" concept="Community Strategy" />
              <FormControl>
                <AIInput
                  label="Community Growth Strategy"
                  placeholder="How will you attract, grow, and engage a vibrant community? (e.g., Online events, educational content, social media campaigns, developer grant programs)."
                  className="resize-y h-28"
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
