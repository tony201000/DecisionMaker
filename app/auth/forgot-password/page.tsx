import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { UnifiedHeader } from "@/components/shared/unified-header"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />
      <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
