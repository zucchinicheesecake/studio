
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LabelWithExplain } from "./label-with-explain";

export function Step4Consensus() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Consensus & Addressing</CardTitle>
        <CardDescription>Finalize the consensus rules and network constants for your cryptocurrency.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <FormControl><Input placeholder="sats" {...field} /></FormControl>
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
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <FormField control={control} name="numberOfConfirmations" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Confirmations" concept="Number of Confirmations" />
                    <FormControl><Input type="number" placeholder="6" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={control} name="targetSpacingInMinutes" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Target Spacing (Minutes)" concept="Target Spacing" />
                    <FormControl><Input type="number" placeholder="10" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
              <FormField control={control} name="targetTimespanInMinutes" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Target Timespan (Minutes)" concept="Target Timespan" />
                    <FormControl><Input type="number" placeholder="1440" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
      </CardContent>
    </Card>
  );
}
