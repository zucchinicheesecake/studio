
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Coins, FileText } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold font-headline">CryptoForge</span>
        </div>
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/forge">Get Started</Link>
            </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
            Create a Cryptocurrency in Minutes
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            CryptoForge is your AI partner for designing, building, and launching your own digital currency. No coding required. Just your vision.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/forge">
                Start Building Now <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <Bot className="h-10 w-10 text-primary"/>
                    </div>
                    <h3 className="text-xl font-bold font-headline">AI-Powered Generation</h3>
                    <p className="text-muted-foreground mt-2">
                        Leverage cutting-edge AI to generate everything from your genesis block to your README file.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <FileText className="h-10 w-10 text-primary"/>
                    </div>
                    <h3 className="text-xl font-bold font-headline">Complete Asset Toolkit</h3>
                    <p className="text-muted-foreground mt-2">
                        Receive a full suite of developer-focused assets including C++ code, configuration files, and documentation.
                    </p>
                </div>
                 <div className="flex flex-col items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <Coins className="h-10 w-10 text-primary"/>
                    </div>
                    <h3 className="text-xl font-bold font-headline">Launch with Confidence</h3>
                    <p className="text-muted-foreground mt-2">
                        Go from a simple idea to a fully-realized project with a professional brand and a clear path to launch.
                    </p>
                </div>
            </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CryptoForge. All rights reserved.</p>
      </footer>
    </div>
  );
}
