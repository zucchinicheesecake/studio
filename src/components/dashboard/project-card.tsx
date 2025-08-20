
"use client";

import type { Project } from "@/app/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const { formValues, logoDataUri, createdAt } = project;

    return (
        <Card className="flex flex-col h-full hover:border-primary/50 transition-colors">
            <CardHeader className="flex-row gap-4 items-center">
                <Image 
                    src={logoDataUri}
                    alt={`${formValues.coinName} logo`}
                    width={50}
                    height={50}
                    className="rounded-full border-2 border-primary/50"
                />
                <div>
                    <CardTitle className="font-headline text-xl">{formValues.coinName}</CardTitle>
                    <CardDescription>{formValues.coinAbbreviation}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                 <p className="text-sm text-muted-foreground line-clamp-3">{project.formValues.problemStatement}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                    Created: {new Date(createdAt).toLocaleDateString()}
                </p>
                <Button variant="secondary" size="sm" asChild>
                    <Link href={`/project/${project.id}`}>View Project</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
