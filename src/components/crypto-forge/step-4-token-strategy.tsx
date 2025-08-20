
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LabelWithExplain } from "./label-with-explain";

export function Step4TokenStrategy() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Token Strategy</CardTitle>
        <CardDescription>Define the purpose and economic design of your project's token.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="tokenUtility"
          render={({ field }) => (
            <FormItem>
              <LabelWithExplain label="Token Utility" concept="Token Utility" />
              <FormControl>
                <Textarea
                  placeholder="What is the token used for? (e.g., Governance votes, paying transaction fees, staking for rewards, accessing exclusive features)."
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="initialDistribution"
          render={({ field }) => (
            <FormItem>
              <LabelWithExplain label="Initial Distribution Plan" concept="Token Distribution" />
              <FormControl>
                <Textarea
                  placeholder="How will the tokens be allocated at launch? (e.g., 50% to the community treasury, 20% to the team (vested), 20% to early investors, 10% for an airdrop)."
                  className="resize-y"
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
