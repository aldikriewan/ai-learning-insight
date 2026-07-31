"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  ArrowRight,
  BookOpen,
  Zap,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Personalized Learning Path",
      description:
        "Jalur pembelajaran yang disesuaikan dengan kecepatan dan gaya belajarmu.",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Structured Curriculum",
      description:
        "Materi tersusun dari dasar hingga advanced level dengan progres yang terukur.",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Real-time Feedback",
      description:
        "Dapatkan feedback langsung untuk setiap latihan yang kamu selesaikan.",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Community Support",
      description:
        "Belajar bersama developer lain dan share pengalaman dalam komunitas.",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "Progress Tracking",
      description:
        "Pantau perkembangan belajarmu dengan dashboard yang jelas dan detail.",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Diverse Courses",
      description:
        "Lebih dari 50 kursus dalam berbagai bahasa pemrograman dan teknologi.",
    },
  ];

  const stats = [
    { number: "5+", label: "Active Learners" },
    { number: "50+", label: "Courses" },
    { number: "92%", label: "Completion Rate" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2 font-bold text-lg">
            <Image
              src="/logo web.png"
              alt="Pacu Pintar Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span>Pacu Pintar</span>
          </Link>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Mulai Belajar Coding
                <span className="block text-primary">dengan Jalur yang Tepat</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Platform pembelajaran coding interaktif dengan kursu terstruktur dan
                feedback real-time. Belajar dengan kecepatan mu sendiri dan raih
                karir impianmu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Mulai Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Login
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="pt-8 grid gap-6 sm:grid-cols-3 border-t">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-bold">{stat.number}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/50 border-y">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold">Fitur Unggulan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Semua yang kamu butuhkan untuk sukses belajar coding
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
                >
                  <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Siap Mulai Belajar?
              </h2>
              <p className="text-lg text-muted-foreground">
                Bergabunglah dengan ribuan developer yang telah meningkatkan skill
                mereka bersama Pacu Pintar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">
                  Daftar Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline">
                  Lihat Semua Kursus
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo web.png"
                alt="Pacu Pintar Logo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="font-semibold">Pacu Pintar</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Pacu Pintar. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
