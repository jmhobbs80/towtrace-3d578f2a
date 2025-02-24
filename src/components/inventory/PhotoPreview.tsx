
import { X } from "lucide-react";

interface PhotoPreviewProps {
  urls: string[];
  itemName: string;
  onRemove: (index: number) => void;
}

export function PhotoPreview({ urls, itemName, onRemove }: PhotoPreviewProps) {
  if (urls.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {urls.map((url, index) => (
        <div key={url} className="relative group">
          <img
            src={url}
            alt={`${itemName} photo ${index + 1}`}
            className="w-20 h-20 object-cover rounded"
          />
          <button
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
