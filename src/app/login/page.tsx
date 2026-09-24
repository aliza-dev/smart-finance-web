import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex w-full bg-background font-sans">
      
      {/* Left Panel: Brand Identity (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-card border-r border-border p-12 justify-between">
        
        {/* Animated Mesh / Glowing Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Brand Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3 w-fit group">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-500">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-foreground font-[family-name:var(--font-playfair)]">SmartSpend</span>
        </Link>

        {/* Quote / Typography */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-semibold text-foreground leading-[1.15] font-[family-name:var(--font-playfair)]">
            Master your finances with <span className="text-muted-foreground">enterprise-grade precision.</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            The intelligent platform for managing expenses, setting goals, and gaining AI-powered insights into your financial future.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="relative z-10 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="h-8 w-8 rounded-full bg-muted border-2 border-background"></div>
            ))}
          </div>
          <p>Join thousands of professionals worldwide.</p>
        </div>
      </div>

      {/* Right Panel: Authentication */}
      <div className="flex flex-1 flex-col justify-center items-center p-8 sm:p-12 relative bg-background">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
                <Wallet className="h-4 w-4" />
              </div>
              <span className="font-semibold text-xl tracking-tight text-foreground font-[family-name:var(--font-playfair)]">SmartSpend</span>
            </Link>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground font-[family-name:var(--font-playfair)]">Welcome back</h2>
            <p className="text-muted-foreground">Log in to your SmartSpend account</p>
          </div>

          <div className="mt-10 space-y-4">
            <form action={async () => { "use server"; await signIn("google", { redirectTo: "/dashboard" }); }}>
              <Button size="lg" type="submit" variant="outline" className="w-full h-12 bg-background text-foreground border-border/50 hover:bg-muted transition-all duration-300 shadow-sm font-medium">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
            </form>
            
            <form action={async () => { "use server"; await signIn("github", { redirectTo: "/dashboard" }); }}>
              <Button size="lg" type="submit" variant="outline" className="w-full h-12 bg-background text-foreground border-border/50 hover:bg-muted transition-all duration-300 shadow-sm font-medium">
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Continue with GitHub
              </Button>
            </form>
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground flex flex-col gap-2">
            <p>By signing in, you agree to our</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <span>&bull;</span>
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
