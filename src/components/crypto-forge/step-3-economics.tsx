"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
                <FormLabel>Block Reward</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <FormField control={control} name="blockHalving" render={({ field }) => (
            <FormItem>
                <FormLabel>Block Halving Interval</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 210000" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <FormField control={control} name="coinSupply" render={({ field }) => (
            <FormItem>
                <FormLabel>Total Coin Supply</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 21000000" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
      </CardContent>
    </Card>
  );
}
