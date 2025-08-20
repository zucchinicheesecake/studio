
interface StepperProps {
  currentStep: number;
  steps: { id: number; name: string }[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative flex-1">
            {step.id < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary"
                >
                  <span className="text-primary-foreground font-bold text-lg">✓</span>
                </div>
              </>
            ) : step.id === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-border" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-card"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-border" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-card"
                >
                </div>
              </>
            )}
             <p className={`absolute -bottom-7 left-1/2 -translate-x-1/2 text-center text-sm font-medium transition-colors duration-300 w-28 ${
                step.id === currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}>
              {step.name}
            </p>
          </li>
        ))}
      </ol>
    </nav>
  );
}
