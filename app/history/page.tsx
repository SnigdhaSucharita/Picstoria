"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api-client";
import { SearchHistoryItem } from "@/lib/types";
import { Search, Clock } from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loadingg } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await apiClient.get<{ history: SearchHistoryItem[] }>(
        "/api/search-history",
      );
      setHistory(data.history || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load search history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    router.push(`/?q=${encodeURIComponent(query)}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const minutes = Math.floor(diff / (1000 * 60));

    if (diff < 0) {
      return "Just now";
    }

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Search History</h1>
          <p className="text-muted-foreground mt-2">Your recent searches</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No search history yet</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Start Searching
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.query}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSearch(item.query)}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search Again
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
