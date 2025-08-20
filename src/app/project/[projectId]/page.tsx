
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { type User, onAuthStateChanged } from "firebase/auth";
import { getProjectById } from "@/app/actions";
import type { Project } from "@/app/types";
import { ResultsDisplay } from "@/components/crypto-forge/results-display";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SavedProjectPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const params = useParams();
  const projectId = params.projectId as string;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (!currentUser) {
            // If user is not logged in, we can stop loading and show an error.
            setLoading(false);
            setError("You must be logged in to view this project.");
        }
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (user && projectId) {
      const fetchProject = async () => {
        setLoading(true);
        setError(null);
        try {
          const fetchedProject = await getProjectById(user.uid, projectId);
          if (fetchedProject) {
            setProject(fetchedProject);
          } else {
            setError("Project not found or you don't have permission to view it.");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load project.");
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [user, projectId]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Project...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col h-screen w-full items-center justify-center text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
        </div>
    );
  }

  if (project) {
    return <ResultsDisplay results={project} isSavedProject={true} />;
  }

  return null; 
}
