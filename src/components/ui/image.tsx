
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LocalImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  priority?: boolean;
}

const Image = forwardRef<HTMLImageElement, LocalImageProps>(
  ({ src, alt, className, priority, ...props }, ref) => {
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
