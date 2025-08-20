
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIInput } from "./ai-input";
import { LabelWithExplain } from "./label-with-explain";

export function Step3TechnicalDetails() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Technical Details</CardTitle>
        <CardDescription>Provide the specific technical inputs for the genesis block and visual assets.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
         <FormField
          control={control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <LabelWithExplain label="Project Tagline" concept="Tagline" />
              <FormControl>
                <AIInput
                  label="Project Tagline"
                  placeholder="A short, memorable phrase that captures the essence of your project."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="timestamp"
          render={({ field }) => (
            <FormItem>
              <LabelWithExplain label="Genesis Block Timestamp Message" concept="Genesis Block Timestamp" />
              <FormControl>
                <AIInput
                  label="Genesis Block Timestamp"
                  placeholder="e.g., A unique headline or phrase to embed in the first block."
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
          name="logoDescription"
          render={({ field }) => (
            <FormItem>
               <LabelWithExplain label="Logo Description" concept="Logo Design" />
              <FormControl>
                <AIInput
                  label="Logo Description"
                  placeholder="e.g., A minimalist geometric shape, like a stylized eagle, in shades of blue and silver."
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
