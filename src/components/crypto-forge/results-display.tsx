"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/crypto-forge/code-block";
import type { GenerationResult } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Download, Rocket } from "lucide-react";
import Image from "next/image";

interface ResultsDisplayProps {
  results: GenerationResult;
  onReset: () => void;
}

export function ResultsDisplay({ results, onReset }: ResultsDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary">Your Cryptocurrency is Forged!</h1>
        <p className="text-muted-foreground mt-2">
          Congratulations! Below are the generated assets for your new coin.
        </p>
      </div>
      
      <Card className="mb-8 bg-card/50 border-primary/20">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
                <Image
                    src={results.logoDataUri}
                    alt="Generated Crypto Logo"
                    width={128}
                    height={128}
                    className="rounded-full border-4 border-primary/50 object-cover"
                />
            </div>
            <div className="flex-grow">
                <CardTitle className="font-headline text-3xl">Launch Your Coin!</CardTitle>
                <CardDescription className="mt-2">You have everything you need. Follow the compilation and node setup guides to bring your cryptocurrency to life.</CardDescription>
            </div>
        </CardHeader>
      </Card>


      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 bg-card border-b">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="whitepaper">Whitepaper</TabsTrigger>
          <TabsTrigger value="genesis">Genesis Block</TabsTrigger>
          <TabsTrigger value="config">Config File</TabsTrigger>
          <TabsTrigger value="compile">Compilation</TabsTrigger>
          <TabsTrigger value="setup">Node Setup</TabsTrigger>
        </TabsList>

        <TabContentCard value="summary">
          <CardHeader>
            <CardTitle>Technical Summary</CardTitle>
            <CardDescription>A recap of your cryptocurrency's key parameters.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: results.technicalSummary.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>') }}></div>
          </CardContent>
        </TabContentCard>

        <TabContentCard value="whitepaper" filename="whitepaper.md" content={results.whitepaperContent}>
          <CardHeader>
            <CardTitle>Whitepaper</CardTitle>
            <CardDescription>The foundational document outlining your cryptocurrency's vision and technology.</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={results.whitepaperContent} language="markdown" />
          </CardContent>
        </TabContentCard>

        <TabContentCard value="genesis" filename="genesis_block.cpp" content={results.genesisBlockCode}>
          <CardHeader>
            <CardTitle>Genesis Block Code</CardTitle>
            <CardDescription>The C++ code for your coin's genesis block.</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={results.genesisBlockCode} language="cpp" />
          </CardContent>
        </TabContentCard>
        
        <TabContentCard value="config" filename="config.txt" content={results.networkConfigurationFile}>
          <CardHeader>
            <CardTitle>Network Configuration</CardTitle>
            <CardDescription>The parameters file for configuring your network nodes.</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={results.networkConfigurationFile} language="ini" />
          </CardContent>
        </TabContentCard>

        <TabContentCard value="compile" filename="compilation_guide.md" content={results.compilationInstructions}>
          <CardHeader>
            <CardTitle>Compilation Instructions</CardTitle>
            <CardDescription>Step-by-step guide to compile your cryptocurrency from source.</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={results.compilationInstructions} language="markdown" />
          </CardContent>
        </TabContentCard>

        <TabContentCard value="setup" filename="node_setup_guide.md" content={results.nodeSetupInstructions}>
          <CardHeader>
            <CardTitle>Initial Node Setup</CardTitle>
            <CardDescription>How to start your first node and begin mining.</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={results.nodeSetupInstructions} language="markdown" />
          </CardContent>
        </TabContentCard>
      </Tabs>
      
       <div className="text-center mt-8">
        <Button onClick={onReset} size="lg">Create Another Coin</Button>
      </div>
    </div>
  );
}


function TabContentCard({ value, filename, content, children }: { value: string, filename?: string, content?: string, children: React.ReactNode }) {
    const handleDownload = () => {
        if(!content || !filename) return;
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

    return (
        <TabsContent value={value}>
            <Card className="mt-4 border-0 shadow-none relative bg-transparent">
                {filename && content && (
                    <div className="absolute top-4 right-4 z-10">
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </div>
                )}
                {children}
            </Card>
        </TabsContent>
    )
}
