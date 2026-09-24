import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, ShieldCheck, ArrowRight, Target, Check, Minus, Star, CalendarDays, PieChart, Bell, Sparkles , Utensils, Film, AlertCircle, LayoutGrid, Tag, Bot } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { auth, signIn } from "@/auth";

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      
      {/* Quiet Luxury Navbar */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center gap-3 group" href="#">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="font-semibold text-xl tracking-tight font-[family-name:var(--font-playfair)]">SmartSpend</span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex items-center gap-6 mr-2">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Benefits</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
          <ThemeToggle />
          {!session ? (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" className="rounded-full px-4 h-9 font-medium hover:bg-muted/50 transition-colors text-foreground">
                  Log In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="rounded-full px-4 sm:px-6 h-9 font-medium shadow-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/dashboard">
              <Button className="rounded-full px-4 sm:px-6 h-9 font-medium shadow-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                Enter Dashboard
              </Button>
            </Link>
          )}
        </nav>
      </header>
      
      <main className="flex-1 overflow-hidden relative">
        
        {/* Soft Background Gradients (Light Mode Only - SchoolHub Style) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 dark:hidden">
          <div className="absolute top-[-10%] left-[10%] w-[40%] h-[50%] rounded-full bg-purple-300/40 blur-[100px]" />
          <div className="absolute top-[20%] right-[-5%] w-[45%] h-[55%] rounded-full bg-blue-300/40 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[45%] rounded-full bg-orange-200/40 blur-[100px]" />
        </div>
        
        {/* Hero Section: SchoolHub Style */}
        <section className="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden py-12">
          <div className="container px-4 md:px-6 z-10 relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Copy & CTA */}
              <div className="flex flex-col items-start space-y-8 text-left">
                
                {/* Refined Pill Badge */}
                <div className="inline-flex items-center rounded-full border border-border/50 px-4 py-1.5 text-xs font-medium bg-muted/30 text-muted-foreground tracking-wide cursor-default transition-colors hover:bg-muted/50">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-primary mr-3"></span>
                  Announcing Gemini AI Financial Insights
                </div>
                
                {/* Elegant Headline */}
                <div className="space-y-6 max-w-2xl">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight font-[family-name:var(--font-playfair)] text-foreground leading-[1.15]">
                    Track expenses clearly.<br className="hidden md:block" />
                    <span className="text-muted-foreground"> Save money smartly.</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground text-base md:text-lg font-normal leading-relaxed">
                    The definitive wealth management platform for individuals who demand perfection. Experience smart tracking, AI-driven insights, and absolute data control.
                  </p>
                </div>
                
                {/* Refined Call to Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                  {session ? (
                    <Link href="/dashboard" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-sm font-medium rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">
                        Open Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <form action={async () => { "use server"; await signIn("google", { redirectTo: "/dashboard" }); }}>
                        <Button size="lg" type="submit" className="w-full sm:w-auto h-12 px-6 text-sm font-medium rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90 transition-opacity flex items-center">
                          <svg className="mr-2 h-5 w-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                          Sign in with Google
                        </Button>
                      </form>
                      
                      <form action={async () => { "use server"; await signIn("github", { redirectTo: "/dashboard" }); }}>
                        <Button size="lg" type="submit" variant="outline" className="w-full sm:w-auto h-12 px-6 text-sm font-medium rounded-full border-border/50 bg-background/50 backdrop-blur-sm text-foreground shadow-sm hover:bg-muted transition-colors flex items-center">
                          <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                          </svg>
                          Sign in with GitHub
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Floating Dashboard Mockup */}
              <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none lg:w-[110%] animate-[float_8s_ease-in-out_infinite]">
                <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md shadow-2xl shadow-blue-900/10 dark:shadow-black/40 p-2 sm:p-3">
                  <div className="w-full aspect-[16/11] rounded-xl bg-background border border-border/50 flex flex-col overflow-hidden relative shadow-inner">
                    
                    {/* Detailed Mockup Header */}
                    <div className="h-12 w-full border-b border-border/40 flex items-center px-5 justify-between bg-card">
                      <div className="flex gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-400"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-32 bg-muted rounded-full"></div>
                        <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center"><div className="h-3 w-3 rounded-full bg-primary" /></div>
                      </div>
                    </div>
                    
                    {/* Mockup Content Grid */}
                    <div className="flex-1 p-5 grid grid-cols-12 gap-5 bg-muted/10">
                      {/* Left Sidebar (Mini) */}
                      <div className="col-span-3 space-y-4 pt-2">
                        <div className="space-y-3">
                          <div className="h-2 w-12 bg-muted-foreground/30 rounded-full mb-4"></div>
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="h-6 w-6 rounded-md bg-muted flex-shrink-0"></div>
                              <div className="h-3 w-full bg-muted rounded-full"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Main Content */}
                      <div className="col-span-9 flex flex-col gap-5">
                        
                        {/* Vibrant Balance Card */}
                        <div className="bg-card rounded-xl border border-border/50 p-5 shadow-sm flex justify-between items-end relative overflow-hidden">
                          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-8 -mt-8"></div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Total Balance</p>
                            <p className="text-3xl font-bold tracking-tight text-foreground">$124,580.00</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full dark:text-emerald-400">+12.5%</span>
                              <span className="text-[10px] text-muted-foreground">vs last month</span>
                            </div>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/40 z-10 relative">
                            <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-5 flex-1">
                          {/* Miniature Transactions */}
                          <div className="bg-card rounded-xl border border-border/50 p-4 shadow-sm flex flex-col">
                            <p className="text-xs font-semibold text-foreground mb-4">Recent Activity</p>
                            <div className="space-y-4 flex-1">
                              {[
                                { name: "Apple Store", amount: "-$1,299", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
                                { name: "Stripe Payout", amount: "+$4,500", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
                                { name: "Whole Foods", amount: "-$145", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
                              ].map((txn, i) => (
                                <div key={i} className="flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${txn.color}`}>
                                      {txn.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[11px] font-medium text-foreground">{txn.name}</span>
                                      <span className="text-[9px] text-muted-foreground">Today</span>
                                    </div>
                                  </div>
                                  <span className={`text-[11px] font-semibold ${txn.amount.startsWith('+') ? 'text-emerald-500 dark:text-emerald-400' : 'text-foreground'}`}>
                                    {txn.amount}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Vibrant Mini Chart */}
                          <div className="bg-card rounded-xl border border-border/50 p-4 shadow-sm flex flex-col">
                            <p className="text-xs font-semibold text-foreground mb-4">Cash Flow</p>
                            <div className="flex-1 flex items-end justify-between gap-1 mt-2">
                              {[40, 25, 60, 30, 80, 50, 95].map((height, i) => (
                                <div key={i} className="w-full flex flex-col justify-end gap-1 h-full">
                                  <div className="w-full bg-blue-500/80 rounded-t-sm transition-all duration-500" style={{ height: `${height}%` }}></div>
                                  <div className="w-full bg-indigo-200/50 dark:bg-indigo-900/50 rounded-b-sm" style={{ height: `${20 + (i * 5)}%` }}></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* As Featured In Section */}
        <section className="w-full py-12 border-y border-border/40 bg-muted/5">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <p className="text-sm font-medium text-muted-foreground mb-8 tracking-widest uppercase">As featured in</p>
            <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-bold text-2xl font-serif tracking-tighter text-foreground">Forbes</div>
              <div className="flex items-center gap-2 font-extrabold text-2xl tracking-tighter text-emerald-600">TechCrunch</div>
              <div className="flex items-center gap-2 font-black text-2xl font-sans tracking-tight text-foreground">Bloomberg</div>
              <div className="flex items-center gap-1 font-bold text-xl font-serif text-foreground">THE WALL STREET JOURNAL.</div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="w-full py-24 bg-background border-t border-border/40">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)] text-foreground">
                Why Choose SmartSpend?
              </h2>
              <p className="text-muted-foreground text-lg">Experience financial freedom with our cutting-edge features.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center mb-6 dark:bg-purple-900/30">
                  <Sparkles className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Eliminate Manual Entry</h3>
                <p className="text-muted-foreground leading-relaxed">Save hours every week using our AI NLP Smart Add for instant categorization. Never type a receipt again.</p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-6 dark:bg-blue-900/30">
                  <PieChart className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Total Financial Clarity</h3>
                <p className="text-muted-foreground leading-relaxed">Interactive Donut and Bar charts give you instant visual insights without needing to do the math.</p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="h-14 w-14 rounded-full bg-rose-100 flex items-center justify-center mb-6 dark:bg-rose-900/30">
                  <Bell className="h-7 w-7 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Never Miss a Due Date</h3>
                <p className="text-muted-foreground leading-relaxed">Automated subscription tracking keeps you ahead of your recurring bills. Unsubscribe before you get charged.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section: Zig-Zag Layout */}
                <section id="features" className="relative w-full py-24 bg-background border-t border-border/40 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            
            <div className="text-center max-w-2xl mx-auto mb-24 space-y-6">
              <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)] tracking-tight text-foreground">
                Architected for Excellence
              </h2>
              <p className="text-base text-muted-foreground font-normal leading-relaxed">
                Every feature meticulously crafted to provide an unparalleled, frictionless financial management experience.
              </p>
            </div>
            
            <div className="space-y-32">
              
              {/* Feature 1: AI Smart Add & NLP */}
              <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center group">
                <div className="space-y-6 md:order-1">
                  <div className="inline-flex h-14 w-14 rounded-2xl bg-purple-100 items-center justify-center dark:bg-purple-900/30">
                    <Sparkles className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-semibold font-[family-name:var(--font-playfair)] text-foreground tracking-tight">AI Smart Add & NLP</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Eliminate manual entry. Just type naturally and let Gemini categorize your spending. Say goodbye to manual category mapping and tedious dropdowns.
                  </p>
                  <ul className="space-y-3 pt-2">
                    <li className="flex items-center gap-3 text-muted-foreground"><Check className="h-5 w-5 text-emerald-500" /> Natural language parsing</li>
                    <li className="flex items-center gap-3 text-muted-foreground"><Check className="h-5 w-5 text-emerald-500" /> Instant categorization</li>
                  </ul>
                </div>
                <div className="relative md:order-2 group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-3xl blur-2xl"></div>
                  <div className="relative bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-border/40 bg-muted/30">
                       <div className="bg-background border border-border/50 rounded-xl p-4 flex items-center gap-3 shadow-inner">
                         <Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0" />
                         <span className="text-sm font-mono text-muted-foreground">Bought a latte for 4.50</span>
                       </div>
                    </div>
                    <div className="p-6 bg-background space-y-4">
                       <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Utensils className="h-4 w-4" /></div>
                             <span className="font-medium text-sm">Food & Dining</span>
                          </div>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Parsed</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: Visual Analytics */}
              <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center group">
                <div className="space-y-6 md:order-2">
                  <div className="inline-flex h-14 w-14 rounded-2xl bg-blue-100 items-center justify-center dark:bg-blue-900/30">
                    <PieChart className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-semibold font-[family-name:var(--font-playfair)] text-foreground tracking-tight">Visual Analytics</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Total financial clarity with interactive Donut and Bar charts. Instantly grasp where your money is going without crunching the numbers yourself.
                  </p>
                </div>
                <div className="relative md:order-1 group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-3xl blur-2xl"></div>
                  <div className="relative bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden p-6">
                    <div className="flex items-end justify-between h-48 gap-2 mb-4">
                      {[30, 45, 25, 60, 40, 80, 55, 90, 70, 50, 85, 40].map((h, i) => (
                        <div key={i} className="w-full bg-blue-500/80 rounded-t-sm hover:bg-blue-400 transition-colors" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t border-border/40">
                       <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3: Interactive Calendar */}
              <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center group">
                <div className="space-y-6 md:order-1">
                  <div className="inline-flex h-14 w-14 rounded-2xl bg-emerald-100 items-center justify-center dark:bg-emerald-900/30">
                    <CalendarDays className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-semibold font-[family-name:var(--font-playfair)] text-foreground tracking-tight">Interactive Calendar</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    See your monthly cashflow at a single glance with visual heatmaps. Track your daily income and expenses on a beautifully crafted calendar view.
                  </p>
                </div>
                <div className="relative md:order-2 group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/10 to-transparent rounded-3xl blur-2xl"></div>
                  <div className="relative bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden p-6">
                    <div className="grid grid-cols-7 gap-2">
                       {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="text-center text-xs font-semibold text-muted-foreground mb-2">{d}</div>)}
                       {Array.from({length: 31}).map((_, i) => (
                         <div key={i} className={`aspect-square rounded-lg flex flex-col items-center justify-center border ${[10, 15, 24].includes(i) ? 'border-rose-500/30 bg-rose-500/5' : [5, 12, 28].includes(i) ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border/40 bg-background/50'}`}>
                           <span className="text-sm font-medium">{i + 1}</span>
                           {[10, 15, 24].includes(i) && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1"></div>}
                           {[5, 12, 28].includes(i) && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1"></div>}
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 4: Pro Budgeting & Goals */}
              <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center group">
                <div className="space-y-6 md:order-2">
                  <div className="inline-flex h-14 w-14 rounded-2xl bg-orange-100 items-center justify-center dark:bg-orange-900/30">
                    <Target className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-3xl font-semibold font-[family-name:var(--font-playfair)] text-foreground tracking-tight">Pro Budgeting & Goals</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Color-coded progress bars and circular savings rings keep you on track. Visually see how close you are to your limits or savings milestones.
                  </p>
                </div>
                <div className="relative md:order-1 group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-3xl blur-2xl"></div>
                  <div className="relative bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden p-6 space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Monthly Budget</span>
                        <span className="text-orange-500">75%</span>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Vacation Fund</span>
                        <span className="text-emerald-500">40%</span>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 5: Subscriptions & Reminders */}
              <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center group">
                <div className="space-y-6 md:order-1">
                  <div className="inline-flex h-14 w-14 rounded-2xl bg-rose-100 items-center justify-center dark:bg-rose-900/30">
                    <Bell className="h-7 w-7 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-3xl font-semibold font-[family-name:var(--font-playfair)] text-foreground tracking-tight">Subscriptions & Reminders</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Never miss a due date with automated tracking and segmented bill views. Identify forgotten subscriptions and manage your recurring outflow with ease.
                  </p>
                </div>
                <div className="relative md:order-2 group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-3xl blur-2xl"></div>
                  <div className="relative bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden">
                     <div className="p-4 border-b border-border/50 flex justify-between items-center bg-background">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center"><Film className="h-5 w-5 text-rose-600" /></div>
                           <div>
                              <p className="text-sm font-semibold">Netflix Premium</p>
                              <p className="text-xs text-muted-foreground">Monthly</p>
                           </div>
                        </div>
                        <span className="text-sm font-bold text-foreground">-$22.99</span>
                     </div>
                     <div className="p-3 bg-rose-500/10 flex justify-between items-center border-t border-rose-500/20">
                        <span className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Due in 2 days</span>
                        <div className="text-xs font-medium bg-background px-2 py-1 rounded shadow-sm border border-border">Manage</div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Feature 6: Custom Numpad & Categories */}
              <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center group">
                <div className="space-y-6 md:order-2">
                  <div className="inline-flex h-14 w-14 rounded-2xl bg-indigo-100 items-center justify-center dark:bg-indigo-900/30">
                    <LayoutGrid className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-3xl font-semibold font-[family-name:var(--font-playfair)] text-foreground tracking-tight">Custom Numpad & Categories</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Personalize your ledger with custom colors, icons, and a lightning-fast dark mode calculator. Designed for one-handed operation.
                  </p>
                </div>
                <div className="relative md:order-1 group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-3xl blur-2xl"></div>
                  <div className="relative bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden p-6 flex justify-center">
                    <div className="grid grid-cols-3 gap-3 w-48">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((k, i) => (
                        <div key={i} className="aspect-square rounded-full bg-muted/50 flex items-center justify-center text-lg font-medium hover:bg-muted transition-colors cursor-pointer border border-border/40 shadow-sm">
                          {k}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 7: 'Need vs. Want' Tagging */}
              <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center group">
                <div className="space-y-6 md:order-1">
                  <div className="inline-flex h-14 w-14 rounded-2xl bg-teal-100 items-center justify-center dark:bg-teal-900/30">
                    <Tag className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-3xl font-semibold font-[family-name:var(--font-playfair)] text-foreground tracking-tight">'Need vs. Want' Tagging</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Automated smart tagging to help you follow the 50/30/20 budgeting rule. Instantly see if your spending aligns with your long-term wealth goals.
                  </p>
                </div>
                <div className="relative md:order-2 group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tl from-teal-500/10 to-transparent rounded-3xl blur-2xl"></div>
                  <div className="relative bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg border border-border/50 bg-background shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center dark:bg-slate-800"><span className="text-lg">🛒</span></div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Groceries</span>
                            <span className="text-xs text-muted-foreground">$120.00</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 border border-teal-200 dark:border-teal-800">Need</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg border border-border/50 bg-background shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center dark:bg-slate-800"><span className="text-lg">🎮</span></div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Video Game</span>
                            <span className="text-xs text-muted-foreground">$59.99</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800">Want</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 8: AI Financial Advisor */}
              <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center group">
                <div className="space-y-6 md:order-2">
                  <div className="inline-flex h-14 w-14 rounded-2xl bg-sky-100 items-center justify-center dark:bg-sky-900/30">
                    <Bot className="h-7 w-7 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="text-3xl font-semibold font-[family-name:var(--font-playfair)] text-foreground tracking-tight">AI Financial Advisor</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    A dedicated AI chatbot for personalized wealth management and advice. Ask complex questions about your spending patterns and get actionable insights.
                  </p>
                </div>
                <div className="relative md:order-1 group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-transparent rounded-3xl blur-2xl"></div>
                  <div className="relative bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden flex flex-col h-64">
                    <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center dark:bg-sky-900/40">
                        <Bot className="h-4 w-4 text-sky-600" />
                      </div>
                      <span className="font-semibold text-sm">SmartSpend AI</span>
                    </div>
                    <div className="p-4 space-y-4 flex-1 flex flex-col justify-end bg-background">
                       <div className="self-end bg-primary text-primary-foreground text-sm py-2 px-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                         How can I cut back on dining out this month?
                       </div>
                       <div className="self-start bg-muted/50 border border-border/50 text-sm py-3 px-4 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm leading-relaxed">
                         You've spent $340 on dining so far. If you cook at home for the next 4 days, you'll stay under your $400 monthly limit.
                       </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-24 bg-background border-t border-border/40">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
              <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)] text-foreground">
                Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground text-lg">Choose the plan that best fits your financial journey.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              
              {/* Basic Tier */}
              <div className="flex flex-col p-8 rounded-3xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-8">
                  <div className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-semibold mb-4 dark:bg-slate-800 dark:text-slate-300">Free</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Free</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">$0</span>
                    <span className="text-muted-foreground font-medium">/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">Essential tools for personal tracking.</p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="h-5 w-5 text-emerald-500" /> Manual tracking</li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="h-5 w-5 text-emerald-500" /> Basic dashboard</li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="h-5 w-5 text-emerald-500" /> 1 savings goal</li>
                </ul>
                <Link href="/login" className="w-full mt-auto">
                  <Button variant="outline" className="w-full rounded-full border-border/60 shadow-sm h-11 hover:bg-muted/50">Get Started</Button>
                </Link>
              </div>

              {/* Pro Tier (Most Popular) */}
              <div className="flex flex-col p-8 rounded-3xl border-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-card relative z-10 transform md:-translate-y-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-shadow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
                  Most Popular
                </div>
                <div className="mb-8 mt-2">
                  <div className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold mb-4 dark:bg-blue-900/40 dark:text-blue-300">Professional</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">$3.99</span>
                    <span className="text-muted-foreground font-medium">/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">Advanced AI capabilities for the power user.</p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-foreground font-medium"><Check className="h-5 w-5 text-blue-500" /> AI Smart Add</li>
                  <li className="flex items-center gap-3 text-sm text-foreground font-medium"><Check className="h-5 w-5 text-blue-500" /> Gemini Insights</li>
                  <li className="flex items-center gap-3 text-sm text-foreground font-medium"><Check className="h-5 w-5 text-blue-500" /> Tax-Ready Exports</li>
                  <li className="flex items-center gap-3 text-sm text-foreground font-medium"><Check className="h-5 w-5 text-blue-500" /> Unlimited tracking</li>
                </ul>
                <Link href="/login" className="w-full mt-auto">
                  <Button className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-11 text-base">Upgrade to Pro</Button>
                </Link>
              </div>

              {/* Premium Tier */}
              <div className="flex flex-col p-8 rounded-3xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-8">
                  <div className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 px-3 py-1 text-xs font-semibold mb-4 dark:bg-purple-900/40 dark:text-purple-300">Enterprise</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Premium</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">$7.99</span>
                    <span className="text-muted-foreground font-medium">/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">The ultimate financial operating system.</p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="h-5 w-5 text-purple-500" /> Multi-currency support</li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="h-5 w-5 text-purple-500" /> Unlimited Goals</li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="h-5 w-5 text-purple-500" /> PWA access</li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="h-5 w-5 text-purple-500" /> Priority support</li>
                </ul>
                <Link href="/login" className="w-full mt-auto">
                  <Button variant="outline" className="w-full rounded-full border-border/60 shadow-sm h-11 hover:bg-muted/50">Go Premium</Button>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Detailed Feature Comparison Matrix */}
        <section className="w-full py-24 bg-muted/5 border-t border-border/40 hidden md:block">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-semibold font-[family-name:var(--font-playfair)] text-foreground">
                Compare Plans
              </h2>
              <p className="text-muted-foreground text-lg">Find the perfect fit for your financial goals.</p>
            </div>
            
            <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
              <div className="grid grid-cols-4 bg-muted/30 border-b border-border/50 p-6 font-semibold">
                <div className="col-span-1 text-foreground">Features</div>
                <div className="col-span-1 text-center text-foreground">Basic ($0)</div>
                <div className="col-span-1 text-center text-blue-600 dark:text-blue-400">Pro ($3.99)</div>
                <div className="col-span-1 text-center text-purple-600 dark:text-purple-400">Premium ($7.99)</div>
              </div>
              
              {/* Category: Tracking & Analytics */}
              <div className="bg-muted/10 px-6 py-3 font-medium text-sm text-muted-foreground uppercase tracking-wider">Tracking & Analytics</div>
              <div className="grid grid-cols-4 px-6 py-4 border-b border-border/30 hover:bg-muted/5 transition-colors">
                <div className="col-span-1 text-sm text-foreground">Manual Transactions</div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-emerald-500" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-blue-500" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-purple-500" /></div>
              </div>
              <div className="grid grid-cols-4 px-6 py-4 border-b border-border/30 hover:bg-muted/5 transition-colors">
                <div className="col-span-1 text-sm text-foreground">Interactive Calendar View</div>
                <div className="col-span-1 flex justify-center"><Minus className="h-5 w-5 text-muted-foreground/40" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-blue-500" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-purple-500" /></div>
              </div>
              <div className="grid grid-cols-4 px-6 py-4 border-b border-border/30 hover:bg-muted/5 transition-colors">
                <div className="col-span-1 text-sm text-foreground">Visual Analytics (Donut/Bar Charts)</div>
                <div className="col-span-1 flex justify-center"><Minus className="h-5 w-5 text-muted-foreground/40" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-blue-500" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-purple-500" /></div>
              </div>
              <div className="grid grid-cols-4 px-6 py-4 border-b border-border/30 hover:bg-muted/5 transition-colors">
                <div className="col-span-1 text-sm text-foreground">Pro Numpad UI</div>
                <div className="col-span-1 flex justify-center"><Minus className="h-5 w-5 text-muted-foreground/40" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-blue-500" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-purple-500" /></div>
              </div>
              <div className="grid grid-cols-4 px-6 py-4 border-b border-border/30 hover:bg-muted/5 transition-colors">
                <div className="col-span-1 text-sm text-foreground">Unlimited Tracking</div>
                <div className="col-span-1 flex justify-center"><Minus className="h-5 w-5 text-muted-foreground/40" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-blue-500" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-purple-500" /></div>
              </div>

              {/* Category: Budgeting & Goals */}
              <div className="bg-muted/10 px-6 py-3 font-medium text-sm text-muted-foreground uppercase tracking-wider">Budgeting & Goals</div>
              <div className="grid grid-cols-4 px-6 py-4 border-b border-border/30 hover:bg-muted/5 transition-colors">
                <div className="col-span-1 text-sm text-foreground">Savings Goals (Circular Rings)</div>
                <div className="col-span-1 text-center text-sm font-medium text-muted-foreground">1 Goal</div>
                <div className="col-span-1 text-center text-sm font-medium text-blue-600">5 Goals</div>
                <div className="col-span-1 text-center text-sm font-medium text-purple-600">Unlimited</div>
              </div>
              <div className="grid grid-cols-4 px-6 py-4 border-b border-border/30 hover:bg-muted/5 transition-colors">
                <div className="col-span-1 text-sm text-foreground">Visual Budgeting (Progress Bars)</div>
                <div className="col-span-1 flex justify-center"><Minus className="h-5 w-5 text-muted-foreground/40" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-blue-500" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-purple-500" /></div>
              </div>
              <div className="grid grid-cols-4 px-6 py-4 border-b border-border/30 hover:bg-muted/5 transition-colors">
                <div className="col-span-1 text-sm text-foreground">Subscription Tracking</div>
                <div className="col-span-1 flex justify-center"><Minus className="h-5 w-5 text-muted-foreground/40" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-blue-500" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-purple-500" /></div>
              </div>

              {/* Category: AI & Automation */}
              <div className="bg-muted/10 px-6 py-3 font-medium text-sm text-muted-foreground uppercase tracking-wider">AI & Automation</div>
              <div className="grid grid-cols-4 px-6 py-4 border-b border-border/30 hover:bg-muted/5 transition-colors">
                <div className="col-span-1 text-sm text-foreground">AI Smart Add (Receipt Scanner)</div>
                <div className="col-span-1 flex justify-center"><Minus className="h-5 w-5 text-muted-foreground/40" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-blue-500" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-purple-500" /></div>
              </div>
              <div className="grid grid-cols-4 px-6 py-4 border-b border-border/30 hover:bg-muted/5 transition-colors">
                <div className="col-span-1 text-sm text-foreground">Gemini Insights & Reports</div>
                <div className="col-span-1 flex justify-center"><Minus className="h-5 w-5 text-muted-foreground/40" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-blue-500" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-purple-500" /></div>
              </div>

              {/* Category: Advanced & Export */}
              <div className="bg-muted/10 px-6 py-3 font-medium text-sm text-muted-foreground uppercase tracking-wider">Advanced & Support</div>
              <div className="grid grid-cols-4 px-6 py-4 border-b border-border/30 hover:bg-muted/5 transition-colors">
                <div className="col-span-1 text-sm text-foreground">Tax-Ready Exports (CSV/PDF)</div>
                <div className="col-span-1 flex justify-center"><Minus className="h-5 w-5 text-muted-foreground/40" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-blue-500" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-purple-500" /></div>
              </div>
              <div className="grid grid-cols-4 px-6 py-4 border-b border-border/30 hover:bg-muted/5 transition-colors">
                <div className="col-span-1 text-sm text-foreground">Multi-Currency Support</div>
                <div className="col-span-1 flex justify-center"><Minus className="h-5 w-5 text-muted-foreground/40" /></div>
                <div className="col-span-1 flex justify-center"><Minus className="h-5 w-5 text-muted-foreground/40" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-purple-500" /></div>
              </div>
              <div className="grid grid-cols-4 px-6 py-4 hover:bg-muted/5 transition-colors">
                <div className="col-span-1 text-sm text-foreground">Priority Support</div>
                <div className="col-span-1 flex justify-center"><Minus className="h-5 w-5 text-muted-foreground/40" /></div>
                <div className="col-span-1 flex justify-center"><Minus className="h-5 w-5 text-muted-foreground/40" /></div>
                <div className="col-span-1 flex justify-center"><Check className="h-5 w-5 text-purple-500" /></div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials (Social Proof) Grid */}
        <section className="w-full py-24 bg-background border-t border-border/40">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)] text-foreground">
                Loved by modern professionals.
              </h2>
              <p className="text-muted-foreground text-lg">Join thousands who have already taken control of their wealth.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Sarah J.", role: "Freelance Designer", quote: "SmartSpend completely changed how I handle my finances. The AI receipt scanner is pure magic and saves me hours every week." },
                { name: "Marcus T.", role: "Software Engineer", quote: "The UI is absolutely gorgeous. It feels like a premium banking app but gives me total control over my data. Worth every penny for the Pro tier." },
                { name: "Elena R.", role: "Small Business Owner", quote: "I used to dread tax season. With SmartSpend's clean exports and automated categorizations, I just click a button and I'm done." },
              ].map((testimonial, i) => (
                <div key={i} className="flex flex-col p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="flex gap-1 mb-6 text-amber-500">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <p className="text-foreground leading-relaxed flex-1 text-sm md:text-base font-medium">&quot;{testimonial.quote}&quot;</p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-24 bg-muted/10 border-t border-border/40 relative">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
              <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)] text-foreground">
                How It Works
              </h2>
              <p className="text-muted-foreground text-lg">Three simple steps to absolute financial clarity.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
              {/* Connecting Line for Desktop */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-border/60 -z-10" />
              
              {[
                { step: "01", title: "Connect & Import", desc: "Securely link your accounts or upload CSVs and receipt images. We handle the formatting." },
                { step: "02", title: "AI Categorization", desc: "Gemini AI instantly reads receipts and transactions, perfectly organizing your data." },
                { step: "03", title: "Gain Insights", desc: "Beautiful dashboards and customized AI reports give you immediate clarity on your spending." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4">
                  <div className="h-24 w-24 rounded-full bg-background border-4 border-muted flex items-center justify-center shadow-sm">
                    <span className="text-2xl font-bold font-mono text-muted-foreground">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mt-4">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Minimalist Trust Section */}
        <section className="w-full py-24 bg-background border-t border-border/40 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto rounded-3xl bg-card border border-border/50 p-12 text-center shadow-sm">
              <ShieldCheck className="h-10 w-10 mx-auto mb-6 text-muted-foreground/60" strokeWidth={1.5} />
              <h2 className="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-playfair)] mb-4 text-foreground">Uncompromising Quality. Zero Cost.</h2>
              <p className="text-base text-muted-foreground mb-10 font-normal leading-relaxed">
                We believe premium financial tools should be accessible. <br className="hidden md:block" />
                100% Free. Secure OAuth via Google & GitHub. Powered by Next.js & Prisma.
              </p>
              
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-sm font-medium rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">
                  Create Your Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-24 bg-muted/10 border-t border-border/40">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)] text-foreground">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion className="w-full">
              <AccordionItem value="item-1" className="border-border/40">
                <AccordionTrigger className="text-left font-medium text-base hover:text-primary transition-colors">Is my financial data secure?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Absolutely. We use industry-standard encryption, and authentication is handled securely via OAuth providers (Google, GitHub). We never sell your data and use the latest best practices in modern web security.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-border/40">
                <AccordionTrigger className="text-left font-medium text-base hover:text-primary transition-colors">Is this platform really 100% free?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Yes! We believe premium financial tools should be accessible to everyone. Our core features are completely free to use without any hidden fees or paywalls.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-border/40">
                <AccordionTrigger className="text-left font-medium text-base hover:text-primary transition-colors">Can I use multiple currencies like $, €, and Rs?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Yes, you can select your preferred currency from the Settings menu. All dashboards, tables, and exports will dynamically format your finances to display your chosen currency.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-border/40">
                <AccordionTrigger className="text-left font-medium text-base hover:text-primary transition-colors">How does the AI Smart Scanner work?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  When you upload a receipt, our system securely sends the image to Google&apos;s Gemini multimodal AI. It intelligently extracts the merchant name, total amount, date, and automatically categorizes the expense with high accuracy.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="border-border/40">
                <AccordionTrigger className="text-left font-medium text-base hover:text-primary transition-colors">Can I export my data for tax purposes?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Yes, our &quot;Enterprise Exports&quot; feature allows you to generate cleanly formatted, comprehensive PDF reports of all your transactions, budgets, and savings goals at any time, perfect for tax season or accounting.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Pre-Footer CTA Banner */}
        <section className="w-full py-24 bg-primary text-primary-foreground border-t border-border/40 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('/noise.png')] mix-blend-overlay"></div>
          <div className="absolute -top-[50%] -left-[10%] w-[50%] h-[200%] rounded-full bg-white/10 blur-[120px] transform rotate-12"></div>
          <div className="absolute -bottom-[50%] -right-[10%] w-[60%] h-[200%] rounded-full bg-black/10 blur-[120px] transform -rotate-12"></div>
          
          <div className="container px-4 md:px-6 relative z-10 text-center flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-semibold font-[family-name:var(--font-playfair)] mb-6 max-w-3xl leading-tight">
              Track, budget, and feel good about your money with SmartSpend in your corner.
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-10 max-w-xl">
              Takes less than 2 minutes to set up. No credit card required for the free tier.
            </p>
            <Link href="/login">
              <Button size="lg" className="h-14 px-10 text-base font-semibold rounded-full bg-white text-primary shadow-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </section>

      </main>
      
      {/* Premium Footer */}
      <footer id="contact" className="py-16 bg-background border-t border-border/40">
        <div className="container px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Wallet className="h-5 w-5 text-primary" />
                <span className="font-semibold text-xl font-[family-name:var(--font-playfair)] text-foreground">SmartSpend</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                The modern standard for financial clarity. Secure, elegant, and powerfully simple wealth management for everyone.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Integrations</Link></li>
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">User Guides</Link></li>
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API Docs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2026 SmartSpend. All rights reserved.</p>
            <div className="flex gap-4">
              {/* Optional: Add social icons here if needed */}
            </div>
          </div>
        </div>
      </footer>
      
      {/* Subtle floating animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </div>
  );
}
