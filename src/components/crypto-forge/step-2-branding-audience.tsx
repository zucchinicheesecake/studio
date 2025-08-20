
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIInput } from "./ai-input";
import { LabelWithExplain } from "./label-with-explain";

export function Step2BrandingAudience() {
  const { control } = useFormContext();

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Branding & Audience</CardTitle>
        <CardDescription>Define who you're building for and the personality of your project.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <FormField
          control={control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <LabelWithExplain label="Target Audience" concept="Target Audience" />
              <FormControl>
                <AIInput
                  label="Target Audience"
                  placeholder="e.g., DeFi power users who are frustrated with high gas fees. Or, artists and creators who want to monetize their work through NFTs."
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
          name="brandVoice"
          render={({ field }) => (
            <FormItem>
              <LabelWithExplain label="Brand Voice" concept="Brand Voice" />
              <FormControl>
                <AIInput
                  label="Brand Voice"
                  placeholder="e.g., Professional and trustworthy, aiming to attract institutional investors. Or, fun, quirky, and meme-friendly to build a viral community."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
      </CardContent>
    </Card>
  );
}
