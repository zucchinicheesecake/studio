
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/crypto-forge/code-block";
import type { GenerationResult, Project } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Download, Save, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { saveProject } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Separator } from "../ui/separator";


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

  const projectDate = isSavedProject && 'createdAt' in results ? new Date((results as Project).createdAt).toLocaleDateString() : new Date().toLocaleDateString();

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-headline font-bold text-primary">{isSavedProject ? results.formValues.projectName : "Your Crypto Project is Ready!"}</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {isSavedProject ? `Viewing saved project details for ${results.formValues.ticker}.` : "Congratulations! Below are the generated assets for your new project."}
        </p>
      </div>
      
      <Card className="mb-8 bg-card/50 border-primary/20">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left p-6">
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
                <CardTitle className="font-headline text-3xl">{results.formValues.projectName} ({results.formValues.ticker})</CardTitle>
                <CardDescription className="mt-2 text-base">{isSavedProject ? `Created on ${projectDate}` : "Your developer toolkit is ready. Follow the README to get started."}</CardDescription>
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
             {isSavedProject && (
                <div className="flex-shrink-0">
                    <Button asChild>
                        <Link href="/dashboard"><ArrowLeft className="mr-2" /> Back to Dashboard</Link>
                    </Button>
                </div>
            )}
        </CardHeader>
      </Card>

      <div className="space-y-8">
            <ResultSection
                title="Genesis Block"
                filename="genesis_block.cpp"
                content={results.genesisBlockCode}
            >
                <CodeBlock code={results.genesisBlockCode} language="cpp" />
            </ResultSection>

            <Separator />

            <ResultSection
                title="Network Configuration"
                filename={`${results.formValues.projectName.toLowerCase()}.conf`}
                content={results.networkConfigurationFile}
            >
                <CodeBlock code={results.networkConfigurationFile} language="ini" />
            </ResultSection>

            <Separator />
            
            <ResultSection
                title="README"
                filename="README.md"
                content={results.readmeContent}
            >
                 <Card className="bg-card/50">
                    <CardContent className="p-6">
                         <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: results.readmeContent.replace(/\n/g, '<br />') }} />
                    </CardContent>
                </Card>
            </ResultSection>
        </div>
      
       <div className="text-center mt-12">
       {isSavedProject ? (
          <Button asChild size="lg" variant="outline">
            <Link href="/forge">Create a New Project</Link>
          </Button>
        ) : (
          <Button onClick={onReset} size="lg">Create Another Project</Button>
        )}
      </div>
    </div>
  );
}

function ResultSection({ title, filename, content, children }: { title: string, filename: string, content: string, children: React.ReactNode }) {
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        downloadFile(filename, content);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline text-xl text-primary">{title}</h3>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </Button>
            </div>
            {children}
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
