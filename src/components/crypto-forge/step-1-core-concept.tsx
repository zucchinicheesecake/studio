
"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIInput } from "./ai-input";

export function Step1CoreConcept() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Core Concept</CardTitle>
        <CardDescription>Define the fundamental identity and mission of your project. This is the foundation of everything.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={control} name="projectName" render={({ field }) => (
                <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl><Input placeholder="e.g., NovaNet, DeFi-Verse" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="ticker" render={({ field }) => (
                <FormItem>
                    <FormLabel>Ticker Symbol</FormLabel>
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
              <FormLabel>Mission Statement</FormLabel>
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
      </CardContent>
    </Card>
  );
}
