
import { ImageProps } from "next/image";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LocalImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

const Image = forwardRef<HTMLImageElement, LocalImageProps>(
  ({ src, alt, className, ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn("", className)}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";

export default Image;
