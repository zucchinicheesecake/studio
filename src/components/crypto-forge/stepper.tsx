
interface StepperProps {
  currentStep: number;
  steps: { id: number; name: string }[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center justify-center w-full">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center w-full">
          <div className="flex flex-col items-center relative">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                step.id < currentStep
                  ? 'bg-primary border-primary'
                  : step.id === currentStep
                  ? 'border-primary scale-110'
                  : 'border-border'
              }`}
            >
              {step.id < currentStep ? (
                <span className="text-primary-foreground font-bold">✓</span>
              ) : (
                <span className={`font-bold ${step.id === currentStep ? 'text-primary' : 'text-muted-foreground'}`}>{step.id}</span>
              )}
            </div>
             <p className={`absolute top-12 text-center text-sm font-medium transition-colors duration-300 w-32 ${
                step.id === currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}>
              {step.name}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 transition-colors duration-300 ${
                step.id < currentStep ? 'bg-primary' : 'bg-border'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
