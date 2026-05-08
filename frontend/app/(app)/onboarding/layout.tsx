import { WizardStepper } from "@/components/onboarding/WizardStepper"

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-center min-h-full py-8">
      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <WizardStepper />
        {children}
      </div>
    </div>
  )
}
