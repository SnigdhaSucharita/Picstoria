"use client";

import Image from "next/image";
import { Photo } from "@/lib/types";
import { motion } from "framer-motion";

interface ImageCardProps {
  photo: Photo;
  onClick: () => void;
}

export function ImageCard({ photo, onClick }: ImageCardProps) {
  const allTags = [
    ...(photo.aiGeneratedTags || []),
    ...(photo.customTags || []),
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative rounded-lg overflow-hidden cursor-pointer group shadow-md"
      onClick={onClick}
    >
      <div className="relative aspect-auto">
        <Image
          src={photo.imageUrl}
          alt="Photo"
          width={400}
          height={600}
          className="w-full h-auto object-cover"
        />
      </div>

      {allTags.length > 0 && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded-full bg-white/20 text-white backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
              {allTags.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-white/20 text-white backdrop-blur-sm">
                  +{allTags.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
