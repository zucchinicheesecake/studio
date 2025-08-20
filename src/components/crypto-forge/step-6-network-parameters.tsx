
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LabelWithExplain } from "./label-with-explain";
import { Award, Scaling, Coins, CaseSensitive, Atom, Hourglass, CheckCheck, Timer, History } from "lucide-react";

export function Step6NetworkParameters() {
  const { control } = useFormContext();

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Network Parameters</CardTitle>
        <CardDescription>Define the core economic and operational rules for your blockchain network.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={control} name="blockReward" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Block Reward" concept="Block Reward" />
                    <FormControl><Input icon={<Award />} type="number" placeholder="50" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="blockHalving" render={({ field }) => (
                <FormItem>
                     <LabelWithExplain label="Block Halving Interval" concept="Block Halving" />
                    <FormControl><Input icon={<Scaling />} type="number" placeholder="210000" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={control} name="coinSupply" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Total Coin Supply" concept="Total Coin Supply" />
                    <FormControl><Input icon={<Coins />} type="number" placeholder="100000000" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={control} name="addressLetter" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Address Letter" concept="Address Prefix" />
                    <FormControl><Input icon={<CaseSensitive />} placeholder="N" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={control} name="coinUnit" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Smallest Coin Unit" concept="Coin Unit" />
                    <FormControl><Input icon={<Atom />} placeholder="sats" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="coinbaseMaturity" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Coinbase Maturity" concept="Coinbase Maturity" />
                    <FormControl><Input icon={<Hourglass />} type="number" placeholder="100" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <FormField control={control} name="numberOfConfirmations" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Confirmations" concept="Number of Confirmations" />
                    <FormControl><Input icon={<CheckCheck />} type="number" placeholder="6" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={control} name="targetSpacingInMinutes" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Target Spacing (Minutes)" concept="Target Spacing" />
                    <FormControl><Input icon={<Timer />} type="number" placeholder="10" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
              <FormField control={control} name="targetTimespanInMinutes" render={({ field }) => (
                <FormItem>
                    <LabelWithExplain label="Target Timespan (Minutes)" concept="Target Timespan" />
                    <FormControl><Input icon={<History />} type="number" placeholder="1440" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
      </CardContent>
    </Card>
  );
}
