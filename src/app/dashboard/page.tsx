
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    // This is a placeholder page. In the future, it will list the user's saved projects.
    const projects = []; // Placeholder for saved projects

    return (
        <div className="flex flex-col min-h-screen bg-background">
             <header className="container mx-auto px-4 h-16 flex items-center justify-between border-b border-border">
                <h1 className="text-2xl font-bold font-headline text-primary">
                    <Link href="/">CoinGenius</Link>
                </h1>
                <div className="flex items-center gap-4">
                    {/* Placeholder for future User Auth info */}
                    <p className="text-sm text-muted-foreground">user@example.com</p>
                    <Button variant="outline">Log Out</Button>
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
                    // This section will be populated with project cards once we have project saving functionality.
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {/* Project cards will go here */}
                    </div>
                )}
            </main>
        </div>
    );
}
