
"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LabelWithExplain } from "./label-with-explain";

export function Step2BlockchainParameters() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Blockchain Parameters</CardTitle>
        <CardDescription>Define the core economic and operational rules of your blockchain network.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <FormControl><Input type="number" placeholder="21000000" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <FormField control={control} name="addressLetter" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Address Letter" concept="Address Prefix" />
                    <FormControl><Input placeholder="N" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={control} name="coinUnit" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Smallest Coin Unit" concept="Coin Unit" />
                    <FormControl><Input placeholder="satoshi" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="coinbaseMaturity" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Coinbase Maturity" concept="Coinbase Maturity" />
                    <FormControl><Input type="number" placeholder="100" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <FormField control={control} name="numberOfConfirmations" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Confirmations" concept="Number of Confirmations" />
                    <FormControl><Input type="number" placeholder="6" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={control} name="targetSpacingInMinutes" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Target Spacing (Mins)" concept="Target Spacing" />
                    <FormControl><Input type="number" placeholder="10" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
              <FormField control={control} name="targetTimespanInMinutes" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Target Timespan (Mins)" concept="Target Timespan" />
                    <FormControl><Input type="number" placeholder="1440" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
      </CardContent>
    </Card>
  );
}
