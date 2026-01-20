"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api-client";
import { SearchResult } from "@/lib/types";
import { Search, Sparkles, Image as ImageIcon, Tag } from "lucide-react";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await apiClient.get<{ results: SearchResult[] }>(
        `/api/photos/search?query=${encodeURIComponent(query)}`
      );
      setResults(data.results || []);
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

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Discover Photos with AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Search, curate, and organize your photo collection using semantic search powered by artificial intelligence
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search for photos (e.g., sunset over mountains)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 text-base"
            />
            <Button type="submit" size="lg" disabled={loading}>
              <Search className="h-5 w-5 mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>

          {results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              {results.map((result, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                  <Image
                    src={result.imageUrl}
                    alt="Search result"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm px-4">
                      Score: {result.score.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 justify-center pt-8">
            <Link href="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border bg-card space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">AI-Powered Search</h3>
              <p className="text-muted-foreground">
                Find photos using natural language. Our AI understands context and meaning.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Beautiful Collections</h3>
              <p className="text-muted-foreground">
                Organize your photos in stunning masonry layouts with automatic color palettes.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Smart Tagging</h3>
              <p className="text-muted-foreground">
                AI suggests relevant tags automatically. Add custom tags for better organization.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
