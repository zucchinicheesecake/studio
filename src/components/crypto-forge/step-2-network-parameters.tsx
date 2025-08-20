
"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LabelWithExplain } from "./label-with-explain";

export function Step2NetworkParameters() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Network Parameters</CardTitle>
        <CardDescription>Define the core economic and operational parameters of your blockchain network.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={control} name="blockReward" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Block Reward" concept="Block Reward" />
                    <FormControl><Input type="number" placeholder="50" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="blockHalving" render={({ field }) => (
                <FormItem>
                     <LabelWithExplain label="Block Halving Interval" concept="Block Halving" />
                    <FormControl><Input type="number" placeholder="210000" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={control} name="coinSupply" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Total Coin Supply" concept="Total Coin Supply" />
                    <FormControl><Input type="number" placeholder="100000000" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
      </CardContent>
    </Card>
  );
}
