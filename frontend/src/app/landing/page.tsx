"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  ArrowRight,
  BookOpen,
  Zap,
  Users,
  CheckCircle2,
  Sparkles,
  Code2,
  Rocket,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

const typingLines = [
  { text: "const learner = new PacuPintar();", delay: 800 },
  { text: "learner.setPath('fullstack');", delay: 800 },
  { text: "learner.start(); // Mulai belajar", delay: 800 },
  { text: "output: 'Skill meningkat 92%'", delay: 1000 },
];

export default function LandingPage() {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const line = typingLines[currentLine];
    if (!line) return;

    let charIndex = isDeleting ? line.text.length : 0;
    const direction = isDeleting ? -1 : 1;

    const typeInterval = setInterval(() => {
      charIndex += direction;
      
      if (charIndex <= 0 && isDeleting) {
        setDisplayText("");
        setIsDeleting(false);
        setCurrentLine((prev) => (prev + 1) % typingLines.length);
        clearInterval(typeInterval);
        return;
      }
      
      if (charIndex >= line.text.length && !isDeleting) {
        setDisplayText(line.text);
        setIsDeleting(true);
        clearInterval(typeInterval);
        
        // Wait before deleting
        setTimeout(() => {
          setIsDeleting(true);
        }, line.delay);
        return;
      }

      setDisplayText(line.text.slice(0, charIndex));
    }, isDeleting ? 30 : 50);

    return () => clearInterval(typeInterval);
  }, [currentLine, isDeleting]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

const features = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Jalur Personal",
    description: "Materi yang disesuaikan dengan kemampuan dan kecepatan belajar Anda",
    number: "01",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Kurikulum Terstruktur",
    description: "Dari dasar hingga advanced dengan progres yang terukur terukur",
    number: "02",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Feedback Real-time",
    description: "Dapatkan umpan balik langsung setelah setiap latihan",
    number: "03",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Komunitas Belajar",
    description: "Berinteraksi dengan ribuan pembelajar dan berbagi pengalaman",
    number: "04",
  },
  {
    icon: <CheckCircle2 className="h-5 w-5" />,
    title: "Pelacakan Progres",
    description: "Monitor perkembangan Anda dengan dashboard yang jelas",
    number: "05",
  },
  {
    icon: <Code2 className="h-5 w-5" />,
    title: "50+ Kursus",
    description: "Berbagai bahasa pemrograman dan teknologi terkini",
    number: "06",
  },
];

  const stats = [
    { number: "5+", label: "Active Learners" },
    { number: "50+", label: "Courses" },
    { number: "92%", label: "Completion Rate" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px'
      }} />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
<Link href="/landing" className="flex items-center gap-3 group">
              <img
                src="/logo%20web.png"
                alt="Pacu Pintar logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-contain"
                loading="eager"
              />
              <span className="font-display font-semibold text-lg tracking-tight">
                Pacu<span className="text-amber-400">Pintar</span>
              </span>
            </Link>

          <div className="flex items-center gap-6">
            <ModeToggle />
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Login
            </Link>
            <Link href="/register">
              <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300">
                Mulai Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-24 pb-32 sm:pt-32 sm:pb-40">
          {/* Large gradient orbs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-400/3 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-medium tracking-wide uppercase">
                <Rocket className="h-3 w-3" />
                Platform Pembelajaran Coding
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight">
                <span className="block">Mulai Belajar</span>
                <span className="block mt-2 text-foreground">Coding</span>
                <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-normal text-muted-foreground/60 tracking-wide">
                  dengan Jalur yang Tepat
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Platform pembelajaran coding interaktif dengan kursu terstruktur dan feedback real-time. 
                Belajar dengan kecepatan mu sendiri dan raih karir impianmu.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-0.5 group">
                    Mulai Gratis
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-border/10 text-foreground/80 hover:bg-muted/50 hover:border-border/20">
                    Login
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-border/50">
                {stats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-3xl sm:text-4xl font-display font-bold text-foreground">{stat.number}</div>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Terminal Animation */}
            <div className="relative">
              <div className="bg-[#12121a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs text-white/30 font-mono">pacupintar — terminal</span>
                </div>

                {/* Terminal body */}
                <div className="p-6 font-mono text-sm leading-relaxed min-h-[300px]">
                  <div className="text-white/30 mb-4">// Pacu Pintar Learning Terminal</div>
                  {typingLines.map((line, i) => (
                    <div key={i} className="mb-2">
                      <span className="text-amber-400/60">$</span>{" "}
                      {i === currentLine && isDeleting ? (
                        <span className="text-white/90">{displayText}</span>
                      ) : i === currentLine ? (
                        <>
                          <span className="text-white/90">{displayText}</span>
                          {showCursor && <span className="text-amber-400 animate-pulse">|</span>}
                        </>
                      ) : i < currentLine ? (
                        <span className="text-white/60">{line.text}</span>
                      ) : (
                        <span className="text-white/20">{line.text}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-amber-500/10 rounded-2xl pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-amber-400/5 rounded-full pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-24 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
              <div>
                <span className="text-amber-400/60 font-mono text-xs tracking-widest uppercase">Features</span>
                <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3 tracking-tight">
                  Kenapa <span className="text-amber-400">Pacu Pintar</span>
                </h2>
              </div>
              <p className="text-white/40 max-w-md text-lg">
                Semua yang kamu butuhkan untuk sukses belajar coding, dalam satu platform.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group relative p-8 rounded-2xl border border-border/50 bg-card hover:bg-card/80 transition-all duration-500 hover:border-amber-500/20 cursor-default"
                >
                  {/* Number */}
                  <span className="absolute top-4 right-4 font-display text-6xl font-bold text-muted-foreground/10 group-hover:text-amber-500/10 transition-colors duration-500">
                    {feature.number}
                  </span>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 group-hover:bg-amber-500/20 transition-colors duration-300">
                    {feature.icon}
                  </div>

                  <h3 className="font-display text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-32 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.03] via-transparent to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[200px] pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative">
            <span className="text-amber-400/60 font-mono text-xs tracking-widest uppercase">Get Started</span>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 tracking-tight">
              Siap Mengubah
              <span className="block text-amber-400">Karirmu?</span>
            </h2>

<p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                Bergabunglah dengan ribuan developer yang telah meningkatkan skill mereka bersama Pacu Pintar. 
                Mulai dari nol, sampai jadi profesional.
              </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-10 py-6 text-lg shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-1">
                  Daftar Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-white/10 text-white/80 hover:bg-white/5 hover:border-white/20 px-10 py-6 text-lg">
                  Jelajahi Kursus
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-30">
              <span className="text-xs text-muted-foreground uppercase tracking-widest opacity-60">Trusted by 5+ learners</span>
              <span className="text-xs uppercase tracking-widest text-white/50">92% completion rate</span>
              <span className="text-xs uppercase tracking-widest text-white/50">50+ courses</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-black font-display font-bold text-[10px]">PP</span>
              </div>
              <span className="font-display font-semibold text-sm">Pacu Pintar</span>
            </div>
            <div className="text-xs text-white/30">
              © {new Date().getFullYear()} Pacu Pintar. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}