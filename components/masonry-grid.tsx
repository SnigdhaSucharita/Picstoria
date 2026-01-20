"use client";

import Masonry from "react-masonry-css";
import { Photo } from "@/lib/types";
import { ImageCard } from "./image-card";

interface MasonryGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export function MasonryGrid({ photos, onPhotoClick }: MasonryGridProps) {
  const breakpointColumns = {
    default: 4,
    1536: 3,
    1024: 2,
    640: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {photos.map((photo) => (
        <div key={photo.id} className="mb-4">
          <ImageCard photo={photo} onClick={() => onPhotoClick(photo)} />
        </div>
      ))}
    </Masonry>
  );
}
