"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { getCookie } from "cookies-next";


interface ProfileContentProps {
  user?: {
    name?: string | null;
    city?: string | null;
    image_path?: string | null;
  };
}

// Helper: Convert File to Base64 string
// Ini penting agar gambar bisa disimpan sebagai text di localStorage
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ProfileContent = ({ user }: ProfileContentProps) => {
  const [displayName, setDisplayName] = useState("");
  const [cityuser, setCityuser] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State untuk URL avatar (bisa dari DB atau preview lokal)
  const [avatarUrl, setAvatarUrl] = useState("");

  // State untuk menyimpan file fisik yang dipilih user
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Ref untuk memicu input file yang tersembunyi
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const token = getCookie("token");
    setEnrolling(!!token);
  }, []);

  useEffect(() => {
    // 1. Prioritas data dari Props (Server Side)
    if (user) {
      setDisplayName(user.name || "");
      setAvatarUrl(user.image_path || "");
      setCityuser(user.city || "");
      return;
    }

    // 2. Fallback ke LocalStorage jika Props kosong
    if (typeof window !== "undefined") {
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
        try {
          const storedData = JSON.parse(storedUserStr);

          // Handle struktur data yang mungkin berbeda
          const loadedName = storedData.user?.name || storedData.name || "";
          const loadedCity = storedData.user?.city || storedData.city || "";
          const loadedImage =
            storedData.user?.image_path || storedData.image_path || "";

          setDisplayName(loadedName);
          setCityuser(loadedCity);
          setAvatarUrl(loadedImage);
        } catch (error) {
          console.error("Gagal parsing data user dari local storage", error);
        }
      }
    }
  }, [user]);

  // Fungsi saat tombol "Change Avatar" diklik
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Fungsi saat user memilih file gambar
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Membuat URL sementara untuk preview gambar (Blob URL)
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // 1. Siapkan FormData untuk dikirim ke API
      const formData = new FormData();
      formData.append("name", displayName);
      formData.append("city", cityuser);

      // Jika ada file gambar baru, masukkan ke formData
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      // 2. Kirim ke API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          method: "PUT",
          headers: {
            // Jangan set Content-Type manual saat menggunakan FormData
          },
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      // 3. Handle Response
      if (response.ok) {
        toast.success("Profile updated successfully!");

        // 4. Update Local Storage
        if (typeof window !== "undefined") {
          const storedUserStr = localStorage.getItem("user");
          if (storedUserStr) {
            const storedData = JSON.parse(storedUserStr);

            // PERBAIKAN DI SINI:
            // Gunakan 'let' agar nilainya bisa diubah jika ada upload baru
            let newImagePath = data.data?.image_path || avatarUrl;

            // Jika user upload file baru, kita convert ke Base64 untuk disimpan di LocalStorage
            // (Blob URL tidak akan bertahan setelah refresh, Base64 bertahan)
            if (selectedFile) {
              try {
                const base64String = await fileToBase64(selectedFile);
                newImagePath = base64String;
              } catch (e) {
                console.error("Gagal convert image ke base64:", e);
              }
            }

            // Update object storage sesuai struktur yang ada
            if (storedData.user) {
              storedData.user.name = displayName;
              storedData.user.city = cityuser;
              storedData.user.image_path = newImagePath;
            } else {
              storedData.name = displayName;
              storedData.city = cityuser;
              storedData.image_path = newImagePath;
            }

            // Simpan kembali ke browser
            localStorage.setItem("user", JSON.stringify(storedData));
          }
        }
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-lg font-medium ">Profile</h3>
      </div>
      <Separator />

      <div className="flex items-center gap-6">
        <Avatar className="w-20 h-20 border-2 border-slate-100">
          <AvatarImage
            src={avatarUrl || "https://github.com/shadcn.png"}
            className="object-cover"
          />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAvatarClick}
            type="button"
            disabled={!enrolling}
          >
            Change Avatar
          </Button>
          <p className="text-xs  mt-2">
            JPG, GIF or PNG. Max 2MB.
          </p>
        </div>
      </div>
     
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your display name"
          />
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="city">Kota</Label>
          <Input
            id="city"
            value={cityuser}
            onChange={(e) => setCityuser(e.target.value)}
            placeholder="Enter your City"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading || displayName.length < 3 || !enrolling}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
