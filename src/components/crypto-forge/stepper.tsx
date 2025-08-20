interface StepperProps {
  currentStep: number;
  steps: string[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex justify-center items-center w-full">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-grow">
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 ${index + 1 <= currentStep ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground text-muted-foreground'}`}>
              <span className="font-bold">{index + 1}</span>
            </div>
            <p className={`mt-2 text-xs text-center font-medium transition-colors duration-300 sm:text-sm ${index + 1 <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
              {step}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-auto h-0.5 mx-4 transition-colors duration-300 ${index + 1 < currentStep ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
