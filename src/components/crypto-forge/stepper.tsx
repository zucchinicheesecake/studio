
interface StepperProps {
  currentStep: number;
  steps: string[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, index) => (
          <li key={step} className={`relative flex-1 ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {/* Completed Step */}
            {index + 1 < currentStep ? (
              <>
                <div className="absolute inset-0 top-4 left-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
              </>
            ) : index + 1 === currentStep ? (
              // Current Step 
              <>
                <div className="absolute inset-0 top-4 left-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-border" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background text-primary"
                >
                   <span className="text-sm font-bold">{index + 1}</span>
                </div>
              </>
            ) : (
              // Upcoming Step
              <>
                <div className="absolute inset-0 top-4 left-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-border" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background text-muted-foreground"
                >
                   <span className="text-sm font-bold">{index + 1}</span>
                </div>
              </>
            )}
            <p className={`absolute top-10 left-1/2 -translate-x-1/2 mt-2 w-max text-center text-xs font-medium transition-colors duration-300 sm:text-sm ${index + 1 <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
              {step}
            </p>
          </li>
        ))}
      </ol>
    </nav>
  );
}
