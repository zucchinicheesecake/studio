
"use client";

import { useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EngineBotIcon } from '@/components/icons/engine-bot-icon';
import { Terminal } from 'lucide-react';
import type { FormValues } from '@/app/types';

interface ChatInterfaceProps {
    onComplete: (data: FormValues) => void;
}

type Question = {
    key: keyof FormValues;
    label: string;
    question: string;
    placeholder: string;
    type?: 'string' | 'number' | 'textarea';
}

const questions: Question[] = [
    { key: "projectName", label: "Project Name", question: "Let's get started. What is the name of your new cryptocurrency project?", placeholder: "e.g., NovaNet, DeFi-Verse" },
    { key: "ticker", label: "Ticker Symbol", question: "Great. Now, what's the ticker symbol for your coin?", placeholder: "e.g., NVT, DFV (3-5 letters)" },
    { key: "missionStatement", label: "Mission Statement", question: "Every great project needs a purpose. What is the core mission statement?", placeholder: "e.g., To build a decentralized internet for the next generation..." },
    { key: "tagline", label: "Tagline", question: "What's a short, catchy tagline for the project?", placeholder: "e.g., The web, rebuilt." },
    { key: "logoDescription", label: "Logo Description", question: "Describe the logo you envision for your project. Be specific about style, colors, and imagery.", placeholder: "e.g., A stylized 'N' that looks like a shield..." },
    { key: "timestamp", label: "Genesis Block Message", question: "What unique message or headline should be embedded in the first block forever?", placeholder: "e.g., A famous headline from today's news..." },
    { key: "blockReward", label: "Block Reward", question: "Now for some technicals. How many coins should be awarded for mining a new block?", placeholder: "e.g., 50" },
    { key: "blockHalving", label: "Block Halving Interval", question: "At what block number should the reward be cut in half?", placeholder: "e.g., 210000" },
    { key: "coinSupply", label: "Total Coin Supply", question: "What is the absolute maximum number of coins that will ever exist?", placeholder: "e.g., 21000000" },
    { key: "addressLetter", label: "Address Letter", question: "What letter should all public addresses for your coin start with?", placeholder: "e.g., N" },
    { key: "coinUnit", label: "Smallest Coin Unit", question: "What is the name of the smallest, most divisible unit of your coin?", placeholder: "e.g., satoshi" },
    { key: "coinbaseMaturity", label: "Coinbase Maturity", question: "How many blocks must pass before a mined block's reward can be spent?", placeholder: "e.g., 100" },
    { key: "numberOfConfirmations", label: "Confirmations", question: "How many blocks must pass before a transaction is considered irreversible?", placeholder: "e.g., 6" },
    { key: "targetSpacingInMinutes", label: "Target Spacing", question: "What is the ideal time, in minutes, between mined blocks?", placeholder: "e.g., 10" },
    { key: "targetTimespanInMinutes", label: "Target Timespan", question: "And finally, what is the time window, in minutes, for readjusting the network difficulty?", placeholder: "e.g., 1440 (one day)" },
];


export function ChatInterface({ onComplete }: ChatInterfaceProps) {
    const { control, setValue, getValues, trigger } = useFormContext<FormValues>();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [history, setHistory] = useState<{ type: 'bot' | 'user'; content: React.ReactNode }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    

    useEffect(() => {
        if (currentQuestionIndex === 0 && history.length === 0) {
            setHistory([{ type: 'bot', content: questions[0].question }]);
        }
    }, [currentQuestionIndex, history.length]);
    
    useEffect(() => {
      // Scroll to the bottom of the chat history
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [history]);
    
    useEffect(() => {
      // Focus the input when a new question is asked
      inputRef.current?.focus();
    }, [currentQuestionIndex]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const currentQuestion = questions[currentQuestionIndex];
        const fieldName = currentQuestion.key;

        // Update react-hook-form state
        setValue(fieldName, inputValue as any);
        const isValid = await trigger(fieldName);
        
        // Add to chat history
        setHistory(prev => [...prev, { type: 'user', content: inputValue }]);

        if (!isValid) {
            const error = control.getFieldState(fieldName).error;
            setHistory(prev => [...prev, { type: 'bot', content: <span className="text-destructive">{error?.message || "Invalid input. Please try again."}</span> }]);
            setInputValue('');
            return;
        }


        if (currentQuestionIndex < questions.length - 1) {
            const nextQuestionIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextQuestionIndex);
            setHistory(prev => [...prev, { type: 'bot', content: questions[nextQuestionIndex].question }]);
            setInputValue(''); // Clear input for next question
        } else {
            // End of questions, submit the form
            setHistory(prev => [...prev, { type: 'bot', content: "Excellent. All parameters received. Initiating generation sequence..." }]);
            onComplete(getValues());
        }
    };
    
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="flex flex-col h-[75vh] w-full max-w-4xl mx-auto bg-black/70 rounded-lg border border-border overflow-hidden font-code shadow-2xl shadow-primary/10">
            <div className="flex-shrink-0 p-3 bg-black/50 border-b border-border flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary"/>
                <p className="text-sm text-primary">Coin Engine &gt; AI Co-Founder</p>
            </div>
            
            <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6">
                {history.map((item, index) => (
                    <div key={index} className={`flex items-start gap-3 ${item.type === 'user' ? 'flex-row-reverse' : ''}`}>
                        {item.type === 'bot' && (
                             <div className="flex-shrink-0">
                                <EngineBotIcon className="h-8 w-8 text-primary" />
                             </div>
                        )}
                        <div className={`px-4 py-2 rounded-lg max-w-lg ${item.type === 'bot' ? 'bg-card/50' : 'bg-primary text-primary-foreground'}`}>
                           <p className="text-sm whitespace-pre-wrap">{item.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex-shrink-0 p-3 bg-black/50 border-t border-border">
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                    <span className="text-primary font-bold pl-2">$</span>
                     <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={currentQuestion?.placeholder || "Type your answer..."}
                        autoComplete="off"
                    />
                    <Button type="submit" variant="secondary" size="sm">Send</Button>
                </form>
            </div>
        </div>
    );
}

