"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Step4Network() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Network Configuration</CardTitle>
        <CardDescription>Fine-tune the technical parameters that govern network operations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={control} name="coinbaseMaturity" render={({ field }) => (
                <FormItem>
                    <FormLabel>Coinbase Maturity</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 100" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="numberOfConfirmations" render={({ field }) => (
                <FormItem>
                    <FormLabel>Transaction Confirmations</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 6" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={control} name="targetSpacingInMinutes" render={({ field }) => (
                <FormItem>
                    <FormLabel>Target Spacing (Minutes)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="targetTimespanInMinutes" render={({ field }) => (
                <FormItem>
                    <FormLabel>Target Timespan (Minutes)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 1440" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
      </CardContent>
    </Card>
  );
}
