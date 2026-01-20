"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api-client";
import { SearchResult } from "@/lib/types";
import { Search, Sparkles, Image as ImageIcon, Tag, ArrowRight, Zap, Layers, Palette } from "lucide-react";

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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-teal-950/20"></div>
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

        <div className="relative container max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="block mb-2">Your Photos,</span>
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Intelligently Organized
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the future of photo management with AI-powered semantic search.
              Find any moment in your collection using natural language.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-2">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="pt-16 max-w-3xl mx-auto">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">
                <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                  Try it now
                </p>
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    placeholder="Search for 'sunset over mountains' or 'family gathering'..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-14 text-base border-2 flex-1"
                  />
                  <Button type="submit" size="lg" disabled={loading} className="h-14 px-8">
                    <Search className="h-5 w-5 mr-2" />
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </form>

                {results.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                    {results.map((result, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group shadow-lg">
                        <Image
                          src={result.imageUrl}
                          alt="Search result"
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                          <p className="text-white font-semibold">
                            Match: {(result.score * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for Photo Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to organize, search, and enjoy your photo collection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:border-blue-500 dark:hover:border-cyan-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Search</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find photos using natural language descriptions. Our advanced AI understands context, objects, scenes, and emotions in your images.
              </p>
            </div>

            <div className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:border-cyan-500 dark:hover:border-teal-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Layers className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Beautiful Collections</h3>
              <p className="text-muted-foreground leading-relaxed">
                Organize photos in stunning masonry layouts with intelligent sorting. Create collections that tell your story beautifully.
              </p>
            </div>

            <div className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:border-teal-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Palette className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Color Extraction</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automatic color palette generation from your images. Search by color, create mood-based collections, and discover visual harmony.
              </p>
            </div>

            <div className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Tag className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Auto-Tagging</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI automatically suggests relevant tags for your photos. Add custom tags for better organization and faster discovery.
              </p>
            </div>

            <div className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:border-cyan-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Search through thousands of photos in milliseconds. Optimized indexing ensures instant results every time.
              </p>
            </div>

            <div className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:border-teal-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ImageIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure Storage</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your photos are safely stored with enterprise-grade security. Access them from anywhere, on any device.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Photo Library?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of users who are already experiencing the future of photo management
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-10 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
