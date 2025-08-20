
"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  type User
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    // This is a placeholder page. In the future, it will list the user's saved projects.
    const projects = []; // Placeholder for saved projects

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSignOut = async () => {
        await signOut(auth);
    };

    if (loading) {
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
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold font-headline text-primary">Welcome to CoinGenius</h1>
                    <p className="text-muted-foreground mt-2">Sign in or create an account to get started.</p>
                </div>

                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sign In</CardTitle>
                                <CardDescription>Access your dashboard and saved projects.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email-in">Email</Label>
                                        <Input id="email-in" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password-in">Password</Label>
                                        <Input id="password-in" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                                    </div>
                                    {error && <p className="text-sm text-destructive">{error}</p>}
                                    <Button type="submit" className="w-full">Sign In</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="signup">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sign Up</CardTitle>
                                <CardDescription>Create a new account to start building.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email-up">Email</Label>
                                        <Input id="email-up" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password-up">Password</Label>
                                        <Input id="password-up" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                                    </div>
                                     {error && <p className="text-sm text-destructive">{error}</p>}
                                    <Button type="submit" className="w-full">Create Account</Button>
                                </form>
                            </CardContent>
                        </Card>
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
                    <Link href="/">CoinGenius</Link>
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

                {projects.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
                        <h3 className="text-xl font-semibold text-muted-foreground">You haven't created any projects yet.</h3>
                        <p className="text-muted-foreground mt-2">Get started by creating your first cryptocurrency.</p>
                        <Button asChild className="mt-4">
                            <Link href="/forge">Start Your First Project</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {/* Saved project cards will go here in a future update */}
                    </div>
                )}
            </main>
        </div>
    );
}
