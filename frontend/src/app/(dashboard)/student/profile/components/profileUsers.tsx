"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, BookOpen, Trophy, Target } from "lucide-react";
import api from "@/lib/axios";
import { Course } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

type User = {
  name: string;
  email?: string;
  city?: string;
  image_path?: string | null;
};

const ProfileUsersPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }

    const fetchCourses = async () => {
      try {
        const res = await api.get("/student/my-courses");
        setCourses(res.data.data);
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const stats = {
    total: courses.length,
    completed: courses.filter((c) => (c.progress || 0) === 100).length,
    inProgress: courses.filter(
      (c) => (c.progress || 0) > 0 && (c.progress || 0) < 100
    ).length,
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-3 text-center md:text-left">
              <Skeleton className="h-7 w-48 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-64 mx-auto md:mx-0" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-20 w-24 rounded-xl" />
              <Skeleton className="h-20 w-24 rounded-xl" />
              <Skeleton className="h-20 w-24 rounded-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <Avatar className="h-24 w-24 border-4 border-primary/10">
            <AvatarImage
              src={user?.image_path || undefined}
              alt={user?.name}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{user?.name || "User"}</h1>
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-2 sm:gap-4 mt-2 text-muted-foreground">
              {user?.email && (
                <p className="text-sm flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              )}
              {user?.city && (
                <p className="text-sm flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {user.city}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 mt-4 md:mt-0">
            <div className="flex flex-col items-center p-4 rounded-xl bg-muted/50 min-w-20">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Kelas</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-muted/50 min-w-20">
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Selesai</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-muted/50 min-w-[80px]">
              <p className="text-2xl font-bold">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">Aktif</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileUsersPage;
