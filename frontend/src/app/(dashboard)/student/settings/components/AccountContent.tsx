"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { getCookie } from "cookies-next";

const AccountContent = () => {
  const [isLoading, setIsLoading] = useState(false);

  // State untuk form input
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const token = getCookie("token");
    setEnrolling(!!token);
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Validasi Dasar Frontend
    if (newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      setIsLoading(false);
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("Password baru tidak boleh sama dengan password lama");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Kirim ke Backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Penting untuk mengirim cookie/token auth
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password berhasil diubah!", {
          description: "Silakan login ulang jika diperlukan.",
          icon: <CheckCircle2 className="text-green-500" />,
        });

        // Reset form setelah sukses
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Tampilkan error dari backend (misal: "Password lama salah")
        toast.error(data.message || "Gagal mengubah password", {
          icon: <AlertCircle className="text-red-500" />,
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-lg font-medium ">Keamanan Akun</h3>
        <p className="text-sm ">
          Update password Anda secara berkala untuk menjaga keamanan akun.
        </p>
      </div>
      <Separator />

      <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
        {/* Input Password Lama */}
        <div className="grid gap-2">
          <Label htmlFor="current_password">Password Lama</Label>
          <Input
            id="current_password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Masukkan password saat ini"
            required
          />
        </div>

        <Separator className="my-2" />

        {/* Input Password Baru */}
        <div className="grid gap-2">
          <Label htmlFor="new_password">Password Baru</Label>
          <Input
            id="new_password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            required
          />
        </div>

        {/* Konfirmasi Password Baru */}
        <div className="grid gap-2">
          <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
          <Input
            id="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password baru"
            required
            className={
              newPassword && confirmPassword && newPassword !== confirmPassword
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }
          />
          {newPassword &&
            confirmPassword &&
            newPassword !== confirmPassword && (
              <p className="text-xs text-red-500">Password tidak cocok.</p>
            )}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading || !enrolling}>
            {isLoading ? "Memproses..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountContent;
