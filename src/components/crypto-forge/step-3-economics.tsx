
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function Step3Branding() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Brand & Identity</CardTitle>
        <CardDescription>Define the personality of your project. How should it look, feel, and sound?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <FormField
          control={control}
          name="brandVoice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Voice & Tone</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Professional and trustworthy, aiming to attract institutional investors. Or, fun, quirky, and meme-friendly to build a viral community."
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
              <FormLabel>Logo Description</FormLabel>
              <FormControl>
                <Textarea
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
