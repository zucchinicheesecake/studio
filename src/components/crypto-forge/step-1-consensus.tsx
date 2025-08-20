
"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Layers, Cpu, Server, HelpCircle } from "lucide-react";
import { useExplanation } from "@/app/forge/page";
import { Button } from "@/components/ui/button";

const consensusOptions = [
  { value: "Scrypt - Proof of Work and Proof of Stake", label: "Scrypt - PoW & PoS", description: "A hybrid system combining mining and staking for network security.", icon: ShieldCheck },
  { value: "SHA-256 - Proof of Work", label: "SHA-256 - Proof of Work", description: "The original Bitcoin consensus. Secure but requires powerful ASIC miners.", icon: Layers },
  { value: "Scrypt - Proof of Work", label: "Scrypt - Proof of Work", description: "ASIC-resistant mining, allowing for more decentralized participation.", icon: Cpu },
  { value: "X11 - Proof of Work + Masternode", label: "X11 - PoW + Masternode", description: "Energy-efficient mining with a second-tier network of masternodes.", icon: Server },
];

export function Step1Consensus() {
  const { control, watch } = useFormContext();
  const selectedMechanism = watch("consensusMechanism");
  const { handleExplain } = useExplanation();

  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl">Consensus Mechanism</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleExplain("Consensus Mechanism")}>
                <HelpCircle className="mr-2 h-4 w-4"/>
                Explain
            </Button>
        </div>
        <CardDescription>Choose the core engine that secures your cryptocurrency network.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="consensusMechanism"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {consensusOptions.map((option) => (
                    <FormItem key={option.value}>
                      <LabelCard htmlFor={option.value} isSelected={field.value === option.value}>
                        <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                        <div className="flex items-center mb-2">
                           <option.icon className="h-6 w-6 mr-3 text-primary" />
                           <h3 className="font-semibold">{option.label}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </LabelCard>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {selectedMechanism && (
            <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-sm text-accent-foreground/80">
                    You've chosen **{selectedMechanism}**. This choice defines how transactions are validated and new coins are created, directly impacting your coin's security and decentralization.
                </p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

function LabelCard({ htmlFor, isSelected, children }: { htmlFor: string, isSelected: boolean, children: React.ReactNode }) {
    return (
        <FormLabel
            htmlFor={htmlFor}
            className={`block h-full p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/10 shadow-md' : 'border-border hover:border-primary/50'}`}
        >
            {children}
        </FormLabel>
    )
}
