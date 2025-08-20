
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LabelWithExplain } from "./label-with-explain";

export function Step3Economics() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Economic Parameters</CardTitle>
        <CardDescription>Set the rules for coin creation, rewards, and total supply.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField control={control} name="blockReward" render={({ field }) => (
            <FormItem>
                <LabelWithExplain label="Block Reward" concept="Block Reward" />
                <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <FormField control={control} name="blockHalving" render={({ field }) => (
            <FormItem>
                <LabelWithExplain label="Block Halving Interval" concept="Block Halving" />
                <FormControl><Input type="number" placeholder="e.g., 210000" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <FormField control={control} name="coinSupply" render={({ field }) => (
            <FormItem>
                <LabelWithExplain label="Total Coin Supply" concept="Total Coin Supply" />
                <FormControl><Input type="number" placeholder="e.g., 21000000" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
      </CardContent>
    </Card>
  );
}
