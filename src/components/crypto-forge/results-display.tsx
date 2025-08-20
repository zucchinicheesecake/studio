
"use client";

import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/crypto-forge/code-block";
import type { GenerationResult } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Download, Linkedin, MessageSquare, Twitter, TrendingUp, Save, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { LandingPage } from "@/components/crypto-forge/landing-page";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { saveProject } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";


interface ResultsDisplayProps {
  results: GenerationResult;
  onReset?: () => void;
  isSavedProject?: boolean;
}

export function ResultsDisplay({ results, onReset, isSavedProject = false }: ResultsDisplayProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
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


      <Tabs defaultValue="landing-page" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-9">
          <TabsTrigger value="landing-page">Landing Page</TabsTrigger>
          <TabsTrigger value="marketing-kit">Marketing</TabsTrigger>
          <TabsTrigger value="whitepaper">Whitepaper</TabsTrigger>
          <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="genesis">Genesis</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="compile">Compilation</TabsTrigger>
          <TabsTrigger value="setup">Node Setup</TabsTrigger>
        </TabsList>

        <TabContentCard value="landing-page">
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>Landing Page Preview</CardTitle>
                <CardDescription>A live preview of your generated landing page. Download the code to get started!</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => downloadFile('LandingPage.tsx', results.landingPageCode)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Code
              </Button>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[600px] bg-background rounded-lg border overflow-hidden">
                    <div className="h-full w-full overflow-y-auto">
                        <LandingPage
                            logoUrl={results.logoDataUri}
                            generatedCode={results.landingPageCode}
                        />
                    </div>
                </div>
            </CardContent>
        </TabContentCard>

        <TabContentCard value="marketing-kit">
            <CardHeader>
                <CardTitle>Marketing Kit</CardTitle>
                <CardDescription>Use this content to announce your project and build a community.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-headline text-xl text-primary mb-2 flex items-center"><Twitter className="mr-2 h-5 w-5" /> X (Twitter) Thread</h3>
                    <CodeBlock code={results.twitterCampaign} language="markdown" />
                </div>
                <div>
                    <h3 className="font-headline text-xl text-primary mb-2 flex items-center"><Linkedin className="mr-2 h-5 w-5" /> LinkedIn Post</h3>
                    <CodeBlock code={results.linkedInPost} language="markdown" />
                </div>
                <div>
                    <h3 className="font-headline text-xl text-primary mb-2 flex items-center"><MessageSquare className="mr-2 h-5 w-5" /> Discord/Telegram Welcome</h3>
                    <CodeBlock code={results.communityWelcome} language="markdown" />
                </div>
            </CardContent>
        </TabContentCard>
        
        <TabContentCard value="tokenomics">
            <CardHeader>
                <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-6 w-6" />Tokenomics Simulator</CardTitle>
                <CardDescription>A projection of your coin's total supply over its first 10 halving cycles.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <LineChart data={tokenomicsData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis 
                            tickFormatter={(value) => value.toLocaleString()}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            width={80}
                         />
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent
                                indicator="dot"
                                formatter={(value) => value.toLocaleString()}
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
            </CardContent>
        </TabContentCard>

        <TabContentCard value="summary">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Technical Summary</CardTitle>
                <CardDescription>A recap of your cryptocurrency's key parameters.</CardDescription>
              </div>
              {results.audioDataUri && (
                <audio controls src={results.audioDataUri} className="max-h-10">
                    Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none prose-p:text-lg prose-strong:text-primary" dangerouslySetInnerHTML={{ __html: results.technicalSummary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>
          </CardContent>
        </TabContentCard>

        <TabContentCardWithDownload value="whitepaper" filename="whitepaper.md" content={results.whitepaperContent}>
          <CardHeader>
            <CardTitle>Whitepaper</CardTitle>
            <CardDescription>The foundational document outlining your cryptocurrency's vision and technology.</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={results.whitepaperContent} language="markdown" />
          </CardContent>
        </TabContentCardWithDownload>

        <TabContentCardWithDownload value="genesis" filename="genesis_block.cpp" content={results.genesisBlockCode}>
          <CardHeader>
            <CardTitle>Genesis Block Code</CardTitle>
            <CardDescription>The C++ code for your coin's genesis block.</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={results.genesisBlockCode} language="cpp" />
          </CardContent>
        </TabContentCardWithDownload>
        
        <TabContentCardWithDownload value="config" filename="config.txt" content={results.networkConfigurationFile}>
          <CardHeader>
            <CardTitle>Network Configuration</CardTitle>
            <CardDescription>The parameters file for configuring your network nodes.</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={results.networkConfigurationFile} language="ini" />
          </CardContent>
        </TabContentCardWithDownload>

        <TabContentCardWithDownload value="compile" filename="compilation_guide.md" content={results.compilationInstructions}>
          <CardHeader>
            <CardTitle>Compilation Instructions</CardTitle>
            <CardDescription>Step-by-step guide to compile your cryptocurrency from source.</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={results.compilationInstructions} language="markdown" />
          </CardContent>
        </TabContentCardWithDownload>

        <TabContentCardWithDownload value="setup" filename="node_setup_guide.md" content={results.nodeSetupInstructions}>
          <CardHeader>
            <CardTitle>Initial Node Setup</CardTitle>
            <CardDescription>How to start your first node and begin mining.</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={results.nodeSetupInstructions} language="markdown" />
          </CardContent>
        </TabContentCardWithDownload>
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

function TabContentCardWithDownload({ value, filename, content, children }: { value: string, filename: string, content: string, children: React.ReactNode }) {
    const handleDownload = () => {
        downloadFile(filename, content);
    };

    return (
        <TabsContent value={value} className="mt-4">
            <Card className="bg-transparent border-border/50 relative">
                <div className="absolute top-5 right-6 z-10">
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download File
                    </Button>
                </div>
                {children}
            </Card>
        </TabsContent>
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
