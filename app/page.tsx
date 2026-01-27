"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { SearchResultCard } from "@/components/search-result-card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { SearchResult } from "@/lib/types";
import {
  Search,
  Sparkles,
  Image as ImageIcon,
  Tag,
  Plus,
  ArrowRight,
  Zap,
  Layers,
  Palette,
} from "lucide-react";

type SearchResultUI = SearchResult & {
  isSaved?: boolean;
  isSaving?: boolean;
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultUI[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await apiClient.get<{ result: SearchResult[] }>(
        `/api/photos/search?query=${encodeURIComponent(query)}`,
      );
      setResults(data.result || []);
    } catch (error: any) {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePhoto = async (result: SearchResultUI) => {
    if (result.isSaved || result.isSaving) return;

    setResults((prev) =>
      prev.map((r) =>
        r.imageUrl === result.imageUrl ? { ...r, isSaving: true } : r,
      ),
    );

    try {
      const csrfToken = await apiClient.getCsrfToken();
      const res = await apiClient.post<{ photo: { id: string } }>(
        "/api/photos",
        {
          imageUrl: result.imageUrl,
          description: result.description,
        },
        csrfToken,
      );

      setResults((prev) =>
        prev.map((r) =>
          r.imageUrl === result.imageUrl
            ? { ...r, isSaving: false, isSaved: true }
            : r,
        ),
      );

      router.push(`/photos/${res.photo.id}`);
    } catch {
      setResults((prev) =>
        prev.map((r) =>
          r.imageUrl === result.imageUrl ? { ...r, isSaving: false } : r,
        ),
      );

      toast({
        title: "Save failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-teal-950/20"></div>
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

        <div className="relative container max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="block mb-2">Discover & Curate</span>
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Your Perfect Photos
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Search millions of photos with AI-powered semantic search. Find,
              save, and organize stunning images into beautiful collections.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="text-lg px-8 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 border-2"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="pt-16 max-w-3xl mx-auto">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">
                <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                  Try it now
                </p>
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Input
                    type="text"
                    placeholder="Search for 'sunset over mountains' or 'family gathering'..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-14 text-base border-2 flex-1"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="h-14 px-8"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                  {results.map((result) => (
                    <SearchResultCard
                      key={result.imageUrl}
                      imageUrl={result.imageUrl}
                      description={result.description}
                      score={result.score}
                      isAuthenticated={isAuthenticated}
                      isSaved={!!result.isSaved}
                      isSaving={!!result.isSaving}
                      onSave={() => handleSavePhoto(result)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for Photo Curation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to discover, save, and organize stunning
              photos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:border-blue-500 dark:hover:border-cyan-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Search</h3>
              <p className="text-muted-foreground leading-relaxed">
                Search millions of photos using natural language. Our AI
                understands context, objects, scenes, and emotions to find
                exactly what you need.
              </p>
            </div>

            <div className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:border-cyan-500 dark:hover:border-teal-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Layers className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Save to Collections</h3>
              <p className="text-muted-foreground leading-relaxed">
                Save your favorite photos to personalized collections. Organize
                them in stunning masonry layouts that showcase your curated
                taste.
              </p>
            </div>

            <div className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:border-teal-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Palette className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Color Palettes</h3>
              <p className="text-muted-foreground leading-relaxed">
                View automatic color palettes extracted from photos. Discover
                images by their dominant colors and create mood-based
                collections.
              </p>
            </div>

            <div className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Tag className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Tags</h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse photos by AI-generated tags. Filter by themes, objects,
                and scenes to discover exactly what you&apos;re looking for.
              </p>
            </div>

            <div className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:border-cyan-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Search History</h3>
              <p className="text-muted-foreground leading-relaxed">
                Keep track of all your searches. Revisit past queries and
                rediscover photos you loved with your complete search history.
              </p>
            </div>

            <div className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:border-teal-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ImageIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Personal Curation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Build your personal photo library from millions of images. Your
                collections are private and accessible from any device.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Curating?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of users discovering and saving beautiful photos
            every day
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="text-lg px-10 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Start Curating Now
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
