export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full h-full bg-login-background bg-no-repeat bg-cover text-white">
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  )
}
