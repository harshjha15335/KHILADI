# ROYAL EDGE: Reusable Motion System Specification

**Motion System Name:** **MOMENTUM**  
**Engineering Stack:** Framer Motion / Motion (React components), GSAP 3.15 + ScrollTrigger (Homepage & Scrollytelling), Lenis (Scroll Virtualization), ECharts (Data Transitions).

---

## 1. Core Timing & Easing Curves

```typescript
export const MOTION_TOKENS = {
  // Duration tokens
  duration: {
    instant: 0.15,   // Microinteractions, table highlights
    fast: 0.25,      // Dropdowns, tooltip entries
    normal: 0.40,    // Card expansions, tab switches
    deliberate: 0.65,// Section reveals, drawer opens
    cinematic: 0.95, // Hero entrances, SVG mask portals
  },

  // Easing bezier tokens (Derived from Extrafazant & AUGE XP inspection)
  ease: {
    // Standard snappy UI curve
    standard: [0.16, 1, 0.3, 1],       // cubic-bezier(0.16, 1, 0.3, 1)
    
    // Outgoing exit curve (fast acceleration out)
    exit: [0.7, 0, 0.84, 0],           // cubic-bezier(0.7, 0, 0.84, 0)
    
    // Emphasized dramatic entrance (Hero text & portals)
    dramatic: [0.85, 0, 0.15, 1],       // cubic-bezier(0.85, 0, 0.15, 1)
    
    // Spring physics configurations
    springSnappy: { type: "spring", stiffness: 400, damping: 28 },
    springBouncy: { type: "spring", stiffness: 300, damping: 18 },
    springGentle: { type: "spring", stiffness: 180, damping: 24 }
  }
};
```

---

## 2. Reusable Motion Primitives (React / Framer Motion)

### 2.1 Kinetic SplitText Character Reveal (`<KineticHeadline />`)
```tsx
import { motion } from "framer-motion";

interface KineticHeadlineProps {
  text: string;
  className?: string;
}

export const KineticHeadline = ({ text, className }: KineticHeadlineProps) => {
  const words = text.split(" ");
  return (
    <h1 className={`overflow-hidden inline-flex flex-wrap gap-x-3 ${className}`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="overflow-hidden inline-block py-1">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.85,
              delay: wIdx * 0.08,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
};
```

### 2.2 Shared-Element Player Card Expansion (`<PlayerCard />`)
```tsx
import { motion } from "framer-motion";

export const PlayerCard = ({ player, isSelected, onSelect }) => (
  <motion.div
    layoutId={`player-card-${player.id}`}
    onClick={() => onSelect(player.id)}
    className="bg-[#0E1017] border border-white/10 rounded-xl p-5 cursor-pointer relative overflow-hidden"
    whileHover={{ y: -4, borderColor: "rgba(232, 18, 116, 0.5)" }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    <motion.div layoutId={`player-avatar-${player.id}`} className="w-16 h-16 rounded-full overflow-hidden">
      <img src={player.headshotUrl} alt={player.name} className="w-full h-full object-cover" />
    </motion.div>
    <motion.h3 layoutId={`player-name-${player.id}`} className="text-lg font-bold text-white mt-3">
      {player.name}
    </motion.h3>
    <div className="flex justify-between items-center mt-2 text-xs font-mono text-[#9DA3B4]">
      <span>PII: <strong className="text-[#E2B755]">{player.pressureIndex}</strong></span>
      <span>Base: {player.basePrice}</span>
    </div>
  </motion.div>
);
```

### 2.3 FLIP Archival Table Row Reordering
```tsx
import { motion, AnimatePresence } from "framer-motion";

export const PlayerTableRow = ({ player, onHover, onLeave }) => (
  <motion.tr
    layout
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    onMouseEnter={(e) => onHover(player, e)}
    onMouseLeave={onLeave}
    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
  >
    <td className="py-3 px-4 font-mono text-xs text-[#5D6375]">{player.rank}</td>
    <td className="py-3 px-4 font-semibold text-white group-hover:text-[#E81274] transition-colors">{player.name}</td>
    <td className="py-3 px-4 text-xs font-mono text-[#9DA3B4]">{player.role}</td>
    <td className="py-3 px-4 font-mono text-sm font-bold text-[#E2B755]">{player.pressureImpactIndex}</td>
    <td className="py-3 px-4 font-mono text-xs text-[#9DA3B4]">{player.deathOversEconomy}</td>
  </motion.tr>
);
```

---

## 3. Reduced Motion & Performance Safeguards

1. **`useReducedMotion()` Hook Integration:** Every component checks `useReducedMotion()`. When true, durations clamp to `0.01ms`, transforms collapse to instant opacity switches, and Three.js canvas render loops halt.
2. **Offscreen Canvas Culling:** Using `IntersectionObserver`, any WebGL or ECharts canvas that leaves the viewport unhooks its requestAnimationFrame subscriber, preserving 100% of GPU threads for working data tables.
