
interface StepperProps {
  currentStep: number;
  steps: string[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, index) => (
          <li key={step} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
            <div className="flex flex-col items-center">
                {index + 1 < currentStep ? (
                <>
                    <div className="absolute inset-0 top-5 left-0 flex items-center" aria-hidden="true">
                        <div className="h-0.5 w-full bg-primary" />
                    </div>
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span className="font-bold">{index + 1}</span>
                    </div>
                </>
                ) : index + 1 === currentStep ? (
                <>
                    <div className="absolute inset-0 top-5 left-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-border" />
                    </div>
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary/20 text-primary">
                    <span className="font-bold">{index + 1}</span>
                    </div>
                </>
                ) : (
                <>
                    <div className="absolute inset-0 top-5 left-0 flex items-center" aria-hidden="true">
                        <div className="h-0.5 w-full bg-border" />
                    </div>
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-background text-muted-foreground">
                    <span className="font-bold">{index + 1}</span>
                    </div>
                </>
                )}
                <p className={`mt-2 text-xs text-center font-medium transition-colors duration-300 sm:text-sm ${index + 1 <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                {step}
                </p>
            </div>
             { index === steps.length - 1 && 
                <div className="absolute inset-0 top-5 left-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-1/2 bg-border" />
                </div>
            }
          </li>
        ))}
      </ol>
    </nav>
  );
}
