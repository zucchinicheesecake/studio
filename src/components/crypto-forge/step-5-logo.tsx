
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function Step5Logo() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Coin Logo</CardTitle>
        <CardDescription>Describe the logo for your cryptocurrency. The AI will generate it for you!</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="logoDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., A minimalist geometric shape, like a stylized eagle, in shades of blue and silver."
                  className="resize-none"
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
