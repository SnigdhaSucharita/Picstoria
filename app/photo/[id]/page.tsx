"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorPalette } from "@/components/color-palette";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api-client";
import { Photo, SearchResult } from "@/lib/types";
import { ArrowLeft, Plus, X } from "lucide-react";

export default function PhotoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [recommendations, setRecommendations] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [customTag, setCustomTag] = useState("");

  useEffect(() => {
    if (params?.id) {
      loadPhoto(params.id as string);
    }
  }, [params?.id]);

  const loadPhoto = async (id: string) => {
    try {
      const data = await apiClient.get<{
        photo: Photo;
        recommendations: SearchResult[];
      }>(`/api/photos/${id}`);
      setPhoto(data.photo);
      setRecommendations(data.recommendations || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load photo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async (tag: string, isAiTag: boolean = false) => {
    if (!photo || !tag.trim()) return;

    try {
      const csrfToken = await apiClient.getCsrfToken();
      await apiClient.post(
        `/api/photos/${photo.id}/tags`,
        { tag: tag.trim(), type: isAiTag ? "ai" : "custom" },
        csrfToken
      );

      setPhoto({
        ...photo,
        [isAiTag ? "aiGeneratedTags" : "customTags"]: [
          ...(isAiTag ? photo.aiGeneratedTags || [] : photo.customTags || []),
          tag.trim(),
        ],
      });

      if (!isAiTag) {
        setCustomTag("");
      }

      toast({
        title: "Tag added",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTag = async (tag: string, isAiTag: boolean) => {
    if (!photo) return;

    const updatedPhoto = {
      ...photo,
      [isAiTag ? "aiGeneratedTags" : "customTags"]: (
        isAiTag ? photo.aiGeneratedTags : photo.customTags
      )?.filter((t) => t !== tag),
    };
    setPhoto(updatedPhoto);

    toast({
      title: "Tag removed",
    });
  };

  const handleSaveRecommendation = async (imageUrl: string) => {
    try {
      const csrfToken = await apiClient.getCsrfToken();
      await apiClient.post(
        "/api/photos",
        { imageUrl },
        csrfToken
      );

      toast({
        title: "Photo saved",
        description: "Added to your collection",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save photo",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Photo not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-auto rounded-lg overflow-hidden">
            <Image
              src={photo.imageUrl}
              alt="Photo"
              width={800}
              height={1200}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Color Palette</h2>
              {photo.colorPalette && photo.colorPalette.length > 0 ? (
                <ColorPalette colors={photo.colorPalette} />
              ) : (
                <p className="text-muted-foreground">No color palette available</p>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">AI Suggested Tags</h2>
              <div className="flex flex-wrap gap-2">
                {photo.aiGeneratedTags && photo.aiGeneratedTags.length > 0 ? (
                  photo.aiGeneratedTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="group px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag, true)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground">No AI tags available</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Custom Tags</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {photo.customTags && photo.customTags.length > 0 ? (
                  photo.customTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="group px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag, false)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No custom tags yet</p>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddTag(customTag, false);
                }}
                className="flex gap-2"
              >
                <Input
                  type="text"
                  placeholder="Add custom tag..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                />
                <Button type="submit" disabled={!customTag.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Photos</h2>
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4">
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="relative flex-shrink-0 w-64 group rounded-lg overflow-hidden"
                  >
                    <Image
                      src={rec.imageUrl}
                      alt="Recommendation"
                      width={256}
                      height={384}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        onClick={() => handleSaveRecommendation(rec.imageUrl)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
