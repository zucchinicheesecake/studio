
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Cpu, FileText } from "lucide-react";
import Link from "next/link";
import { HappyCoinIcon } from "@/components/icons/happy-coin-icon";
import { EngineBotIcon } from "@/components/icons/engine-bot-icon";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <HappyCoinIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold font-headline">Coin Engine</span>
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
            Launch a Crypto Project with an AI Partner
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Coin Engine is your AI co-founder for designing, building, and launching your own digital currency. No code, just conversation.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/forge">
                Start the Conversation <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto bg-card/50 rounded-xl p-8 border border-border">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                         <EngineBotIcon className="h-16 w-16 text-primary"/>
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold font-headline">From Idea to Install Script, All Through Chat</h3>
                        <p className="text-muted-foreground mt-2">
                            Our unique AI-driven chat interface guides you through every decision, from your project's mission statement to its core technical parameters. At the end, you'll receive a complete, developer-ready toolkit including C++ code, configuration files, a README, and a one-click install script.
                        </p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Coin Engine. All rights reserved.</p>
      </footer>
    </div>
  );
}
