
interface StepperProps {
  currentStep: number;
  steps: { id: number; name: string }[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            {step.id < currentStep ? (
              <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors">
                <span className="text-sm font-medium text-primary transition-colors">
                  {`Step ${step.id}`}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ) : step.id === currentStep ? (
              <div
                className="flex w-full flex-col border-l-4 border-primary py-2 pl-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-primary">
                   {`Step ${step.id}`}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ) : (
              <div className="group flex w-full flex-col border-l-4 border-border py-2 pl-4 transition-colors">
                <span className="text-sm font-medium text-muted-foreground transition-colors">
                   {`Step ${step.id}`}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
