"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { MasonryGrid } from "@/components/masonry-grid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api-client";
import { Photo } from "@/lib/types";
import { Search, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function CollectionPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTag, setSearchTag] = useState("");
  const { user, loadingg } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user]);

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    if (!searchTag.trim()) {
      setFilteredPhotos(photos);
    } else {
      const filtered = photos.filter((photo) => {
        const allTags = [
          ...(photo.suggestedTags || []),
          ...(photo.customTags || []),
        ];
        return allTags.some((tag) =>
          tag.toLowerCase().includes(searchTag.toLowerCase()),
        );
      });
      setFilteredPhotos(filtered);
    }
  }, [searchTag, photos]);

  const loadPhotos = async () => {
    try {
      const data = await apiClient.get<{ photos: Photo[] }>("/api/photos");
      setPhotos(data.photos || []);
      setFilteredPhotos(data.photos || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load photos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    router.push(`/photo/${photo.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Collection</h1>
            <p className="text-muted-foreground mt-2">
              {filteredPhotos.length} photo
              {filteredPhotos.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Button onClick={() => router.push("/")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Photos
          </Button>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter by tag..."
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading photos...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              {searchTag
                ? "No photos match your filter"
                : "No photos yet. Start by searching and saving photos!"}
            </p>
          </div>
        ) : (
          <MasonryGrid
            photos={filteredPhotos}
            onPhotoClick={handlePhotoClick}
          />
        )}
      </main>
    </div>
  );
}
