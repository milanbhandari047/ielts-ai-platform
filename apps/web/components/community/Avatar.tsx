// "use client";

// interface AvatarProps {
//   name: string;
//   avatar?: string | null;
//   size?: number;
// }

// export default function Avatar({ name, avatar, size = 32 }: AvatarProps) {
//   const initials = name
//     .split(" ")
//     .map((w) => w[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

//   if (avatar) {
//     return (
//       <img
//         src={avatar}
//         alt={name}
//         style={{
//           width: size,
//           height: size,
//           borderRadius: "50%",
//           objectFit: "cover",
//           flexShrink: 0,
//         }}
//       />
//     );
//   }

//   const colors = [
//     "#dbeafe|#1d4ed8",
//     "#dcfce7|#15803d",
//     "#fce7f3|#be185d",
//     "#fef3c7|#b45309",
//     "#ede9fe|#6d28d9",
//   ];

//   const [bg, fg] = colors[name.charCodeAt(0) % colors.length].split("|");

//   return (
//     <div
//       style={{
//         width: size,
//         height: size,
//         borderRadius: "50%",
//         background: bg,
//         color: fg,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: size * 0.35,
//         fontWeight: 700,
//         flexShrink: 0,
//         fontFamily: "'DM Sans', sans-serif",
//       }}
//     >
//       {initials}
//     </div>
//   );
// }

"use client";

interface AvatarProps {
  name: string;
  avatar?: string | null;
  size?: number;
}

const PALETTE = [
  "#E8573F",
  "#3B82C4",
  "#2EAF7D",
  "#9B59B6",
  "#E67E22",
  "#1ABC9C",
  "#E91E8C",
  "#5C6BC0",
];

function colorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function Avatar({ name, avatar, size = 36 }: AvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const fontSize = Math.round(size * 0.38);

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          border: "2px solid rgba(255,255,255,0.8)",
        }}
      />
    );
  }

  return (
    <div
      aria-label={name}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: colorFor(name),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "0.02em",
        border: "2px solid rgba(255,255,255,0.6)",
        userSelect: "none",
      }}
    >
      {initials || "?"}
    </div>
  );
}
