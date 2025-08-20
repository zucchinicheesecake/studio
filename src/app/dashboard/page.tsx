
"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  type User
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProjectsForUser } from "@/app/actions";
import type { Project } from "@/app/types";
import { useToast } from "@/hooks/use-toast";
import { ProjectCard } from "@/components/dashboard/project-card";
import { Separator } from "@/components/ui/separator";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.53 1.2.18 2.31.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.72c0 .27.18.58.69.48A10 10 0 0 0 22 12A10 10 0 0 0 12 2Z"/></svg>
);

const AuthForm = ({ type, onSubmit, onOAuth, email, setEmail, password, setPassword, error }: any) => (
    <Card>
        <CardHeader>
            <CardTitle>{type === 'signin' ? 'Sign In' : 'Sign Up'}</CardTitle>
            <CardDescription>
                {type === 'signin' ? 'Access your dashboard and saved projects.' : 'Create a new account to start building.'}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor={`email-${type}`}>{type === 'signin' ? 'Email' : 'Email Address'}</Label>
                    <Input id={`email-${type}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`password-${type}`}>Password</Label>
                    <Input id={`password-${type}`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full">{type === 'signin' ? 'Sign In' : 'Create Account'}</Button>
            </form>
            <div className="my-4 flex items-center">
                <Separator className="flex-1" />
                <span className="px-4 text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
            </div>
            <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => onOAuth('google')}>
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Sign in with Google
                </Button>
                <Button variant="outline" className="w-full" onClick={() => onOAuth('github')}>
                    <GitHubIcon className="mr-2 h-5 w-5" />
                    Sign in with GitHub
                </Button>
            </div>
        </CardContent>
    </Card>
);

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const fetchProjects = async () => {
                setProjectsLoading(true);
                try {
                    const userProjects = await getProjectsForUser(user.uid);
                    setProjects(userProjects);
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "Could not fetch projects.";
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: errorMessage
                    });
                } finally {
                    setProjectsLoading(false);
                }
            };
            fetchProjects();
        } else {
            // Clear projects if user logs out
            setProjects([]);
        }
    }, [user, toast]);

    const handleAuthAction = async (action: 'signIn' | 'signUp', e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setAuthLoading(true);
        try {
            if (action === 'signIn') {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleOAuthSignIn = async (providerName: 'google' | 'github') => {
        setError(null);
        setAuthLoading(true);
        const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setAuthLoading(false);
        }
    };


    const handleSignOut = async () => {
        await signOut(auth);
    };

    if (authLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!user) {
        return (
          <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="mb-8">
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl font-bold font-headline text-primary">Coin Engine</CardTitle>
                        <CardDescription className="text-muted-foreground mt-2">Sign in or create an account to get started.</CardDescription>
                    </CardHeader>
                </Card>

                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <AuthForm
                            type="signin"
                            onSubmit={(e: React.FormEvent) => handleAuthAction('signIn', e)}
                            onOAuth={handleOAuthSignIn}
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            error={error}
                        />
                    </TabsContent>
                    <TabsContent value="signup">
                       <AuthForm
                            type="signup"
                            onSubmit={(e: React.FormEvent) => handleAuthAction('signUp', e)}
                            onOAuth={handleOAuthSignIn}
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            error={error}
                        />
                    </TabsContent>
                </Tabs>
            </div>
          </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
             <header className="container mx-auto px-4 h-16 flex items-center justify-between border-b border-border">
                <h1 className="text-2xl font-bold font-headline text-primary">
                    <Link href="/">Coin Engine</Link>
                </h1>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Button variant="outline" onClick={handleSignOut}>Log Out</Button>
                </div>
            </header>

            <main className="flex-grow container mx-auto p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-headline font-bold">Your Projects</h2>
                    <Button asChild>
                        <Link href="/forge">
                            <PlusCircle className="mr-2" />
                            Create New Coin
                        </Link>
                    </Button>
                </div>

                {projectsLoading ? (
                     <div className="flex h-64 w-full items-center justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
                        <h3 className="text-xl font-semibold text-muted-foreground">You haven't created any projects yet.</h3>
                        <p className="text-muted-foreground mt-2">Get started by creating your first cryptocurrency.</p>
                        <Button asChild className="mt-4">
                            <Link href="/forge">Start Your First Project</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {projects.map((project) => (
                           <ProjectCard key={project.id} project={project} />
                       ))}
                    </div>
                )}
            </main>
        </div>
    );
}

    