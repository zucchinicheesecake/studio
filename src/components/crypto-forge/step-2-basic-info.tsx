
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const addressLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function Step2BasicInfo() {
  const { control } = useFormContext();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Basic Coin Information</CardTitle>
        <CardDescription>Define the identity and core attributes of your new cryptocurrency.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={control} name="coinName" render={({ field }) => (
                <FormItem>
                    <FormLabel>Coin Name</FormLabel>
                    <FormControl><Input placeholder="e.g., NovaCoin" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="coinAbbreviation" render={({ field }) => (
                <FormItem>
                    <FormLabel>Coin Abbreviation</FormLabel>
                    <FormControl><Input placeholder="e.g., NVC" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField control={control} name="addressLetter" render={({ field }) => (
                <FormItem>
                    <FormLabel>Address Letter</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a starting letter" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="1">1 (like Bitcoin)</SelectItem>
                            {addressLetters.map(letter => <SelectItem key={letter} value={letter}>{letter}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="coinUnit" render={({ field }) => (
                <FormItem>
                    <FormLabel>Smallest Unit Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Nova" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        <FormField control={control} name="timestamp" render={({ field }) => (
            <FormItem>
                <FormLabel>Genesis Block Timestamp</FormLabel>
                <FormControl><Input placeholder="A unique sentence for the first block" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={control} name="websiteUrl" render={({ field }) => (
                <FormItem>
                    <FormLabel>Website URL (Optional)</FormLabel>
                    <FormControl><Input placeholder="https://example.com" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="githubUrl" render={({ field }) => (
                <FormItem>
                    <FormLabel>GitHub URL (Optional)</FormLabel>
                    <FormControl><Input placeholder="https://github.com/user/repo" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
      </CardContent>
    </Card>
  );
}
