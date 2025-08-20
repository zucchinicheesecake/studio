
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
        <CardTitle className="font-headline text-2xl">Audience & Voice</CardTitle>
        <CardDescription>Define who you're building for and how you'll communicate with them.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
              <LabelWithExplain label="Brand Voice & Tone" concept="Brand Voice" />
              <FormControl>
                <AIInput
                  label="Brand Voice & Tone"
                  placeholder="e.g., Professional and trustworthy, aiming to attract institutional investors. Or, fun, quirky, and meme-friendly to build a viral community."
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
