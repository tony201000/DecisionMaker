import { UnifiedHeader } from "@/components/shared/unified-header"
import { SignUpForm } from "@/features/auth/sign-up-form"

export default function Page() {
  return (
    <div className="min-h-screen bg-background grid grid-rows-[auto_1fr]">
      <UnifiedHeader />
      <div className="flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}
