import React, { useId } from "react";
/** Original faceless vector study, not a player portrait or an inferred team kit. */
export function StudyAthlete() {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 420 500"
      role="img"
      aria-label="Original non-player-specific cricket athlete silhouette; not a real player's likeness"
      className="rc-athlete"
    >
      <defs>
        <linearGradient id={uid + "shirt"} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#a3bbff" />
          <stop offset=".35" stopColor="#315bc3" />
          <stop offset="1" stopColor="#142759" />
        </linearGradient>
        <linearGradient id={uid + "bat"}>
          <stop stopColor="#f8eac9" />
          <stop offset=".45" stopColor="#d9b875" />
          <stop offset=".6" stopColor="#fff4d9" />
          <stop offset="1" stopColor="#b38d46" />
        </linearGradient>
        <linearGradient id={uid + "pink"}>
          <stop stopColor="#ffabd1" />
          <stop offset="1" stopColor="#ed267b" />
        </linearGradient>
        <linearGradient id={uid + "helmet"} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#7195f4" />
          <stop offset=".45" stopColor="#2448a1" />
          <stop offset="1" stopColor="#0d1c41" />
        </linearGradient>
      </defs>
      <g transform="rotate(-33 295 110)">
        <rect x="289" y="-9" width="15" height="116" rx="5" fill="#273856" />
        <path
          d="M282 82Q274 90 277 112L280 258Q297 276 319 258L322 108Q322 89 312 82Z"
          fill={"url(#" + uid + "bat)"}
          stroke="#fff1cf"
          strokeWidth="2"
        />
        <path d="M299 108V248" stroke="#9d7c44" strokeWidth="1" />
      </g>
      <path
        d="M205 330L144 407 126 487 191 495 216 431 254 378M257 332L308 409 343 489 278 497 241 430 209 375"
        fill="#162951"
        stroke="#7c94cc"
        strokeWidth="2"
      />
      <path
        d="M154 420L142 472 187 480 201 433M280 432L298 482 337 472 316 418"
        fill="#cbd7ef"
        stroke="#7690c5"
        strokeWidth="2"
      />
      <path
        d="M157 437l31 8m-35 4l31 8m108-8l30-10m-24 22l30-10"
        stroke="#95a8cc"
        strokeWidth="4"
      />
      <path
        d="M165 171Q196 145 244 163L275 208 294 330Q236 370 157 329L145 244Z"
        fill={"url(#" + uid + "shirt)"}
        stroke="#b1c5ff"
        strokeWidth="2"
      />
      <path
        d="M163 176L124 226Q120 249 148 258L207 221 192 191"
        fill={"url(#" + uid + "shirt)"}
        stroke="#b1c5ff"
        strokeWidth="2"
      />
      <path
        d="M242 168L270 187 299 141 324 150Q325 187 290 224Q275 235 248 215"
        fill={"url(#" + uid + "pink)"}
        stroke="#ffcee5"
        strokeWidth="2"
      />
      <path
        d="M145 249Q166 248 197 217L265 152 250 131 179 191 139 221"
        fill="#a7b9dd"
        stroke="#e3ebff"
        strokeWidth="2"
      />
      <path
        d="M248 128Q256 116 269 122L281 139 268 160 249 151 242 141ZM299 135Q302 121 316 125L330 137 325 154 306 157Z"
        fill="#f4f2eb"
        stroke="#93a9d6"
        strokeWidth="2"
      />
      <path d="M184 134L183 165Q210 186 231 161L229 132" fill="#667caa" />
      <path
        d="M176 73Q218 48 245 85L250 125 229 152 196 151 178 128Z"
        fill="#7289b3"
      />
      <path
        d="M173 108Q159 71 188 49Q220 29 246 60L252 95 272 107 248 117 188 113Z"
        fill={"url(#" + uid + "helmet)"}
        stroke="#a1b9f5"
        strokeWidth="2"
      />
      <path
        d="M184 95L244 91 259 105 243 144 195 150 181 130Z"
        fill="#152445"
        stroke="#a6bce9"
        strokeWidth="3"
      />
      <path
        d="M185 111l66-5M187 124l60-5m-53-23l7 51m17-54l4 51m14-49l5 36"
        stroke="#b9c9e9"
        strokeWidth="2"
      />
      <path
        d="M170 190Q171 256 178 320M247 233L266 322"
        fill="none"
        stroke="#c8d6ff"
        strokeWidth="2"
        opacity=".5"
      />
      <path
        d="M183 265Q216 287 275 273L280 300Q230 317 176 291Z"
        fill={"url(#" + uid + "pink)"}
        opacity=".85"
      />
      <path
        d="M129 486L119 498H192L194 486M280 487L275 499H352L340 484"
        fill="#e9edfa"
        stroke="#8a9dc6"
        strokeWidth="2"
      />
    </svg>
  );
}
