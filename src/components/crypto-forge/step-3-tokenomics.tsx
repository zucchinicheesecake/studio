
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIInput } from "./ai-input";
import { LabelWithExplain } from "./label-with-explain";

export function Step3Tokenomics() {
  const { control } = useFormContext();

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Tokenomics</CardTitle>
        <CardDescription>Define the purpose and economic design of your project's token.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <FormField
          control={control}
          name="tokenUtility"
          render={({ field }) => (
            <FormItem>
              <LabelWithExplain label="Token Utility" concept="Token Utility" />
              <FormControl>
                <AIInput
                  label="Token Utility"
                  placeholder="What is the token used for? (e.g., Governance votes, paying transaction fees, staking for rewards, accessing exclusive features)."
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
