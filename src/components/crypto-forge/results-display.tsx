
"use client";

import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/crypto-forge/code-block";
import type { GenerationResult } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Download, Linkedin, MessageSquare, Twitter, TrendingUp, Save, Loader2, CheckCircle, ArrowLeft, FileCode, Presentation, Megaphone } from "lucide-react";
import Image from "next/image";
import { LandingPage } from "@/components/crypto-forge/landing-page";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { saveProject } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";


interface ResultsDisplayProps {
  results: GenerationResult;
  onReset?: () => void;
  isSavedProject?: boolean;
}

export function ResultsDisplay({ results, onReset, isSavedProject = false }: ResultsDisplayProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(isSavedProject);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveProject = async () => {
    if (!user) {
        toast({ variant: "destructive", title: "Not Logged In", description: "You must be logged in to save a project." });
        return;
    }
    setIsSaving(true);
    try {
        await saveProject(results, user.uid);
        setIsSaved(true);
        toast({ title: "Project Saved!", description: "Your project has been successfully saved to your dashboard." });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: "destructive", title: "Save Failed", description: errorMessage });
    } finally {
        setIsSaving(false);
    }
  };

  const tokenomicsData = useMemo(() => {
    const { blockReward, blockHalving, coinSupply } = results.formValues;
    const data = [];
    let currentSupply = 0;
    let currentReward = blockReward;
    let blocks = 0;
    let halvings = 0;

    const HALVING_LIMIT = 10; // Show first 10 halving events

    // Initial state
    data.push({ name: `Year 0`, 'Total Supply': 0 });

    while (currentSupply < coinSupply && halvings < HALVING_LIMIT) {
        currentSupply += currentReward * blockHalving;
        blocks += blockHalving;
        halvings++;
        
        data.push({
            name: `Halving ${halvings}`,
            'Total Supply': Math.min(currentSupply, coinSupply),
        });

        currentReward /= 2;
    }
    
    // Ensure final supply is shown
    if (data[data.length -1]['Total Supply'] < coinSupply) {
        data.push({
            name: 'Max Supply',
            'Total Supply': coinSupply
        });
    }

    return data;

  }, [results.formValues]);

  const chartConfig = {
    supply: {
      label: "Total Supply",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-headline font-bold text-primary">{isSavedProject ? results.formValues.coinName : "Your Cryptocurrency is Ready!"}</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {isSavedProject ? `Viewing saved project details for ${results.formValues.coinAbbreviation}.` : "Congratulations! Below are the generated assets for your new coin."}
        </p>
      </div>
      
      <Card className="mb-8 bg-card/50 border-primary/20">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex-shrink-0">
                <Image
                    src={results.logoDataUri}
                    alt="Generated Crypto Logo"
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-primary/50 object-cover"
                />
            </div>
            <div className="flex-grow">
                <CardTitle className="font-headline text-3xl">{isSavedProject ? "Project Overview" : "Launch Your Coin!"}</CardTitle>
                <CardDescription className="mt-2 text-base">{isSavedProject ? `Created on ${new Date(results.createdAt!).toLocaleDateString()}` : "You have everything you need. Follow the compilation and node setup guides to bring your cryptocurrency to life."}</CardDescription>
            </div>
             {user && !isSavedProject && (
                <div className="flex-shrink-0">
                    <Button onClick={handleSaveProject} disabled={isSaving || isSaved}>
                        {isSaving ? (
                            <><Loader2 className="mr-2 animate-spin" /> Saving...</>
                        ) : isSaved ? (
                            <><CheckCircle className="mr-2" /> Project Saved</>
                        ) : (
                            <><Save className="mr-2" /> Save Project</>
                        )}
                    </Button>
                </div>
            )}
        </CardHeader>
      </Card>


      <Tabs defaultValue="brand-assets" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="brand-assets"><Presentation className="mr-2" /> Brand & Marketing</TabsTrigger>
          <TabsTrigger value="tokenomics"><TrendingUp className="mr-2"/> Tokenomics</TabsTrigger>
          <TabsTrigger value="developer-assets"><FileCode className="mr-2" /> Developer Assets</TabsTrigger>
        </TabsList>

        <TabContentCard value="brand-assets">
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>Landing Page & Marketing Kit</CardTitle>
                <CardDescription>Your public-facing assets. Use these to build your brand and community.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible defaultValue="landing-page" className="w-full">
                    <AccordionItem value="landing-page">
                        <AccordionTrigger className="text-xl font-headline text-primary">Landing Page Preview</AccordionTrigger>
                        <AccordionContent>
                           <div className="flex justify-end mb-4">
                             <Button variant="outline" size="sm" onClick={() => downloadFile('LandingPage.tsx', results.landingPageCode)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Code
                              </Button>
                           </div>
                           <div className="w-full h-[600px] bg-background rounded-lg border overflow-hidden">
                                <div className="h-full w-full overflow-y-auto">
                                    <LandingPage
                                        logoUrl={results.logoDataUri}
                                        generatedCode={results.landingPageCode}
                                    />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="whitepaper">
                        <AccordionTrigger className="text-xl font-headline text-primary">Whitepaper</AccordionTrigger>
                        <AccordionContent>
                           <div className="flex justify-end mb-4">
                                <Button variant="outline" size="sm" onClick={() => downloadFile('whitepaper.md', results.whitepaperContent)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Whitepaper
                                </Button>
                           </div>
                           <CodeBlock code={results.whitepaperContent} language="markdown" />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="marketing-kit">
                        <AccordionTrigger className="text-xl font-headline text-primary">Social Media Kit</AccordionTrigger>
                        <AccordionContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2 flex items-center"><Twitter className="mr-2 h-5 w-5" /> X (Twitter) Thread</h3>
                                <CodeBlock code={results.twitterCampaign} language="markdown" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2 flex items-center"><Linkedin className="mr-2 h-5 w-5" /> LinkedIn Post</h3>
                                <CodeBlock code={results.linkedInPost} language="markdown" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2 flex items-center"><MessageSquare className="mr-2 h-5 w-5" /> Discord/Telegram Welcome</h3>
                                <CodeBlock code={results.communityWelcome} language="markdown" />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </TabContentCard>
        
        <TabContentCard value="tokenomics">
            <CardHeader>
                <CardTitle className="flex items-center">Tokenomics & Technical Summary</CardTitle>
                <CardDescription>The economic model and technical parameters of your cryptocurrency.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                     <h3 className="font-headline text-xl text-primary mb-4">Supply Projection</h3>
                    <ChartContainer config={chartConfig} className="h-[400px] w-full">
                        <LineChart data={tokenomicsData} margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis 
                                tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                width={80}
                             />
                            <Tooltip
                                cursor={false}
                                content={<ChartTooltipContent
                                    indicator="dot"
                                    formatter={(value) => typeof value === 'number' ? value.toLocaleString() : value}
                                />}
                            />
                            <Line
                                dataKey="Total Supply"
                                type="monotone"
                                stroke="var(--color-supply)"
                                strokeWidth={2}
                                dot={true}
                            />
                        </LineChart>
                    </ChartContainer>
                </div>
                 <div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                             <h3 className="font-headline text-xl text-primary">Technical Summary</h3>
                             <p className="text-muted-foreground">A recap of your coin's key parameters.</p>
                        </div>
                        {results.audioDataUri && (
                            <audio controls src={results.audioDataUri} className="max-h-10">
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </div>
                    <div className="prose prose-invert max-w-none prose-p:text-base prose-strong:text-primary p-4 bg-black/30 rounded-lg" dangerouslySetInnerHTML={{ __html: results.technicalSummary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>
                 </div>

            </CardContent>
        </TabContentCard>

        <TabContentCard value="developer-assets">
           <CardHeader>
                <CardTitle>Developer Assets</CardTitle>
                <CardDescription>The core code and instructions needed to compile, run, and maintain your network.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible defaultValue="genesis" className="w-full">
                    <AccordionItem value="genesis">
                         <AccordionTriggerWithDownload filename="genesis_block.cpp" content={results.genesisBlockCode}>
                            Genesis Block
                         </AccordionTriggerWithDownload>
                         <AccordionContent>
                            <CodeBlock code={results.genesisBlockCode} language="cpp" />
                         </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="config">
                         <AccordionTriggerWithDownload filename="config.txt" content={results.networkConfigurationFile}>
                           Network Configuration
                         </AccordionTriggerWithDownload>
                         <AccordionContent>
                             <CodeBlock code={results.networkConfigurationFile} language="ini" />
                         </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="compile">
                         <AccordionTriggerWithDownload filename="compilation_guide.md" content={results.compilationInstructions}>
                           Compilation Guide
                         </AccordionTriggerWithDownload>
                         <AccordionContent>
                            <CodeBlock code={results.compilationInstructions} language="markdown" />
                         </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="setup">
                         <AccordionTriggerWithDownload filename="node_setup_guide.md" content={results.nodeSetupInstructions}>
                           Node Setup & Mining Guide
                         </AccordionTriggerWithDownload>
                         <AccordionContent>
                            <CodeBlock code={results.nodeSetupInstructions} language="markdown" />
                         </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </TabContentCard>

      </Tabs>
      
       <div className="text-center mt-12">
       {isSavedProject ? (
          <Button asChild size="lg">
            <Link href="/dashboard"><ArrowLeft className="mr-2" /> Back to Dashboard</Link>
          </Button>
        ) : (
          <Button onClick={onReset} size="lg">Create Another Coin</Button>
        )}
      </div>
    </div>
  );
}


function TabContentCard({ value, children }: { value: string, children: React.ReactNode }) {
    return (
        <TabsContent value={value} className="mt-4">
            <Card className="bg-transparent border-border/50">
                {children}
            </Card>
        </TabsContent>
    )
}

function AccordionTriggerWithDownload({ filename, content, children }: { filename: string, content: string, children: React.ReactNode }) {
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent accordion from toggling
        downloadFile(filename, content);
    };

    return (
        <div className="flex w-full items-center justify-between hover:bg-accent/10 pr-4">
             <AccordionTrigger className="text-xl font-headline text-primary flex-grow hover:no-underline">{children}</AccordionTrigger>
             <Button variant="outline" size="sm" onClick={handleDownload} className="ml-4">
                <Download className="mr-2 h-4 w-4" />
                Download
            </Button>
        </div>
    )
}

const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
