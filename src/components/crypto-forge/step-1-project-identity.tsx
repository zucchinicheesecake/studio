
"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIInput } from "./ai-input";
import { LabelWithExplain } from "./label-with-explain";

export function Step1ProjectIdentity() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Project Identity</CardTitle>
        <CardDescription>Define the fundamental identity and mission of your project. This is the foundation of everything.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={control} name="projectName" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Project Name" concept="Project Name" />
                    <FormControl><Input placeholder="e.g., NovaNet, DeFi-Verse" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="ticker" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Ticker Symbol" concept="Ticker Symbol" />
                    <FormControl><Input placeholder="e.g., NVT, DFV" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        <FormField
          control={control}
          name="missionStatement"
          render={({ field }) => (
            <FormItem>
              <LabelWithExplain label="Mission Statement" concept="Mission Statement" />
              <FormControl>
                <AIInput
                  label="Mission Statement"
                  placeholder="What is the ultimate goal of your project? What problem are you solving?"
                  className="resize-y min-h-[100px]"
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
                  className="resize-y min-h-[100px]"
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
      </CardContent>
    </Card>
  );
}
