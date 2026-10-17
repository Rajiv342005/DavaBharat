const STYLES = {
  "Pain Relief": { main: "#E4572E", dark: "#9C3115", tint: "#FDECE6", kind: "strip" },
  Diabetes: { main: "#2F6FDE", dark: "#1B459B", tint: "#E7EFFD", kind: "strip" },
  "Heart Care": { main: "#C62E5B", dark: "#7E1B38", tint: "#FBE8EE", kind: "strip" },
  "Digestive Care": { main: "#C98A0A", dark: "#7A5206", tint: "#FBF0D6", kind: "strip" },
  "Cold & Allergy": { main: "#7B4FD6", dark: "#4B2C8F", tint: "#EFE9FB", kind: "bottle" },
  "Vitamins & Supplements": { main: "#F07F13", dark: "#A04F05", tint: "#FDEEDC", kind: "bottle" },
  "Skin Care": { main: "#0F9AA8", dark: "#09626B", tint: "#E1F4F6", kind: "tube" },
  "Health Devices": { main: "#3E5C76", dark: "#26394A", tint: "#E6ECF2", kind: "device" },
};

const DEFAULT_STYLE = { main: "#14804A", dark: "#0E5F37", tint: "#E6F4EC", kind: "strip" };

export const getCategoryStyle = (category) => STYLES[category] || DEFAULT_STYLE;

function Strip({ s }) {
  return (
    <g>
      <rect x="16" y="18" width="88" height="64" rx="9" fill="#fff" stroke={s.dark} strokeWidth="2" />
      <path d="M16 34v-7a9 9 0 0 1 9-9h70a9 9 0 0 1 9 9v7z" fill={s.main} />
      {[0, 1, 2, 3].flatMap((i) =>
        [0, 1].map((j) => (
          <circle
            key={`${i}-${j}`}
            cx={32 + i * 19}
            cy={50 + j * 18}
            r="7"
            fill={s.tint}
            stroke={s.main}
            strokeWidth="2"
          />
        ))
      )}
    </g>
  );
}

function Bottle({ s }) {
  return (
    <g>
      <rect x="46" y="14" width="28" height="14" rx="3" fill={s.main} />
      <rect x="36" y="32" width="48" height="56" rx="10" fill="#fff" stroke={s.dark} strokeWidth="2" />
      <rect x="36" y="48" width="48" height="26" fill={s.main} />
      <path d="M60 54v14M53 61h14" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Tube({ s }) {
  return (
    <g>
      <rect x="12" y="38" width="12" height="24" rx="2" fill={s.dark} />
      <rect x="22" y="34" width="68" height="32" rx="7" fill="#fff" stroke={s.dark} strokeWidth="2" />
      <rect x="40" y="34" width="30" height="32" fill={s.main} />
      <rect x="90" y="40" width="16" height="20" rx="3" fill={s.main} />
    </g>
  );
}

function Device({ s }) {
  return (
    <g>
      <rect x="34" y="12" width="52" height="76" rx="11" fill="#fff" stroke={s.dark} strokeWidth="2" />
      <rect x="42" y="22" width="36" height="24" rx="5" fill={s.tint} stroke={s.main} strokeWidth="2" />
      <path
        d="M46 36h6l3-7 5 12 3-5h7"
        stroke={s.main}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="68" r="9" fill={s.main} />
    </g>
  );
}

const SHAPES = { strip: Strip, bottle: Bottle, tube: Tube, device: Device };

export default function MedicineArt({ category, className = "" }) {
  const s = getCategoryStyle(category);
  const Shape = SHAPES[s.kind];
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <Shape s={s} />
    </svg>
  );
}