
interface StepperProps {
  currentStep: number;
  steps: { id: number; name: string }[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                  step.id < currentStep
                    ? 'border-primary bg-primary text-primary-foreground'
                    : step.id === currentStep
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-muted-foreground/50 bg-background text-muted-foreground'
                }`}
              >
                <span className="font-bold">{step.id}</span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-24 transition-colors duration-300 ${
                  step.id < currentStep ? 'bg-primary' : 'bg-muted-foreground/50'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between px-8">
        {steps.map((step) => (
          <div key={step.id} className="text-center w-full">
            <p
              className={`font-medium transition-colors duration-300 ${
                step.id === currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {step.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
