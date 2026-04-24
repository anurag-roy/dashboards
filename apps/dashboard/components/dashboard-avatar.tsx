"use client";

import Avatar from "boring-avatars";

import { cn } from "@/lib/utils";

const avatarPalettes = [
  ["#00bbf9", "#00f5d4", "#9b5de5", "#f15bb5", "#fee440"], // neon but balanced
  ["#06d6a0", "#1b9aaa", "#ef476f", "#ffc43d", "#f4a261"], // modern UI friendly
  ["#2ec4b6", "#e71d36", "#ff9f1c", "#011627", "#4cc9f0"], // strong contrast (no pure black)
  ["#3a86ff", "#8338ec", "#ff006e", "#fb5607", "#ffbe0b"], // high-energy gradient
  ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#8338ec"], // clean contrast set
  ["#f72585", "#b5179e", "#7209b7", "#560bad", "#4cc9f0"], // magenta + purple + cyan
  ["#ff4d6d", "#ff85a1", "#f72585", "#b5179e", "#7209b7"], // pink-heavy punch
  ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"], // balanced spectrum
  ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#5f27cd"], // playful rainbow
  ["#ff7b00", "#ff006e", "#8338ec", "#3a86ff", "#06d6a0"], // bold modern
  ["#ff9f1c", "#ffbf69", "#cbf3f0", "#2ec4b6", "#4361ee"], // orange + teal + blue
  ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff"], // soft but still vibrant
] as const;

const hashSeed = (seed: string) => {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getPaletteForSeed = (seed: string) => {
  const paletteIndex = hashSeed(seed) % avatarPalettes.length;
  return [...avatarPalettes[paletteIndex]!];
};

type DashboardAvatarProps = {
  seed: string;
  className?: string;
  variant?:
    | "pixel"
    | "bauhaus"
    | "ring"
    | "beam"
    | "sunset"
    | "marble"
    | "geometric"
    | "abstract";
  square?: boolean;
};

export function DashboardAvatar({
  seed,
  className,
  variant = "marble",
  square = false,
}: DashboardAvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex size-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted/40",
        square && "rounded-xl",
        className,
      )}
      aria-hidden="true"
    >
      <Avatar
        name={seed}
        size="100%"
        className="size-full"
        variant={variant}
        colors={getPaletteForSeed(seed)}
        square={square}
      />
    </div>
  );
}
