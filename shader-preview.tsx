import { GrainGradient } from "@paper-design/shaders-react";
import { createRoot } from "react-dom/client";

const variants = [
  {
    name: "A corners current",
    props: {
      colors: ["#c79a4e", "#3a2a10", "#0f2420", "#152433"],
      softness: 0.5,
      intensity: 0.5,
      noise: 0.25,
      shape: "corners" as const,
    },
  },
  {
    name: "B corners vivid",
    props: {
      colors: ["#f0cb7b", "#9a6418", "#1a6b52", "#102a3d"],
      softness: 0.55,
      intensity: 0.75,
      noise: 0.3,
      shape: "corners" as const,
    },
  },
  {
    name: "C blob",
    props: {
      colors: ["#e7b85c", "#7a4a12", "#145c47", "#0b1f2e"],
      softness: 0.2,
      intensity: 0.6,
      noise: 0.3,
      shape: "blob" as const,
      scale: 1.1,
    },
  },
  {
    name: "D wave",
    props: {
      colors: ["#f0cb7b", "#a06a1c", "#1d4a3c", "#0c2233"],
      softness: 0.7,
      intensity: 0.35,
      noise: 0.35,
      shape: "wave" as const,
    },
  },
  {
    name: "E ripple",
    props: {
      colors: ["#e7b85c", "#8a5a1a", "#176b50", "#0a1420"],
      softness: 0.5,
      intensity: 0.5,
      noise: 0.4,
      shape: "ripple" as const,
    },
  },
  {
    name: "F sphere",
    props: {
      colors: ["#f4d68e", "#a86f1e", "#1a5c46", "#0a1018"],
      softness: 0.6,
      intensity: 0.4,
      noise: 0.3,
      shape: "sphere" as const,
      scale: 0.9,
    },
  },
  {
    name: "G truchet",
    props: {
      colors: ["#e7b85c", "#3a2a10", "#145c47"],
      softness: 0.3,
      intensity: 0.5,
      noise: 0.4,
      shape: "truchet" as const,
    },
  },
  {
    name: "H blob emerald two-tone",
    props: {
      colors: ["#d9b264", "#123c33", "#08120f"],
      softness: 0.8,
      intensity: 0.9,
      noise: 0.25,
      shape: "blob" as const,
      scale: 1.2,
    },
  },
  {
    name: "I corners deep",
    props: {
      colors: ["#b98a3e", "#241a0c", "#0d2f26", "#0a1420"],
      softness: 0.35,
      intensity: 0.85,
      noise: 0.35,
      shape: "corners" as const,
    },
  },
];

createRoot(document.getElementById("root")!).render(
  <div className="grid">
    {variants.map(({ name, props }) => (
      <figure key={name}>
        <div className="box">
          <GrainGradient {...props} colorBack="#090b0e" speed={0} frame={0} className="size-full" />
        </div>
        <figcaption>{name}</figcaption>
      </figure>
    ))}
  </div>,
);
