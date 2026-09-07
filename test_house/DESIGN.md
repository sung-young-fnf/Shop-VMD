# Forest House design contract

## 1. Direction

Reference: https://ciudad-jardin.vercel.app/, observed in a real browser on 2026-09-07. Captures and computed styles: evidence/reference-site. Transfer its fullscreen isometric diorama, sage atmosphere, cream floating controls, spatial destinations and bottom view toolbar to the user's farmhouse. This is a house-specific adaptation, not a city/brand clone. House geometry is grounded in test_house_reference, not the reference site's assets.

The signature moment is opening the dark standing-seam roof to reveal the rooms in the supplied floor plan. The house is a dimensional, softly lit architectural model with wood posts, warm windows and a garden parcel.

## 2. Colors

UI tokens: --ink #214840, --muted #526a60 (slightly stronger than reference #657b70 for small Korean text), --sage #d6e3da, --surface #f6f9f2, --surface-glass rgba(246,249,242,.94), --border #d9e2d5, --accent #214840, --accent-soft #dfe9cc, --warm #b78454, --white #ffffff, --night #142c31, --night-surface #213c3e, --night-ink #edf2e6, --night-muted #bfd0c7. Scene colors are physical material inputs in src/house and scene palette, not UI tokens.

## 3. Typography

Reference uses Trebuchet MS/Arial, title 24px weight800 tracking -1px, panel heading20px, body13px/21.45px. Adapted stack: Trebuchet MS, Arial, Malgun Gothic, sans-serif. Display28px/1.15 weight700; brand24px/1.1 weight800; heading20px/1.3; body14px/1.65; small12px/1.5; micro10px/1.5 letterspacing .16em. Korean word-break keep-all. Mono labels use ui-monospace, Consolas, monospace.

## 4. Spacing and layout

4px base; tokens s1=4,s2=8,s3=12,s4=16,s5=20,s6=24,s8=32,s10=40,s12=48. Desktop edges32, header top28; panel width256 and top126; toolbar centered bottom28; corner label bottom32. Canvas full viewport; scene framing reserves left panel space. At <=760px edges16; compact header, panel becomes bottom room selector strip, toolbar bottom20, room information is condensed. At <=420px header title20; text labels remain readable. Reference targets 375/768/1280 widths, with responsive house-specific adaptation.

## 5. Primitives

- ActionButton: icon + optional label; normal, hover tinted, pressed scale .97, focus outline2px offset3; min-height44. Icon-only buttons have accessible names. Toggle variants have aria-pressed.
- SegmentedViews: exterior/interior/plan actual buttons; active dark filled state; grouped and labeled. Same state drives the scene and ARIA.
- FloatingPanel: radius24, surface-glass, border1, subtle shadow; fixed for desktop and compact horizontal room strip on mobile.
- RoomButton: small architectural icon, Korean name, muted area, directional affordance; current accent-soft. Every room can be selected without using the canvas.
- StatusChip: passive current mode/theme pill; selected room text is an aria-live region.
- ReferenceDialog: native modal dialog with image switch buttons and source notes; Escape closes; focus returns to the trigger; image aspect ratio preserved and original can open in a tab.
- SceneStatus: loading and actionable error state; error includes a readable floor plan and retry button.

The component state harness is the application toolbar/room list itself, exercised at all target widths; primitives share one stylesheet and button creation functions.

## 6. Motion and interaction

beui.dev/r/tabs/raw consulted: active state maintains spatial continuity and reduced motion snaps; use native CSS/state instead of adding React/Motion. CSS micro150ms ease-out; panel220ms ease-out. Camera motion uses interruptible exponential damping rate6/s (no bounce), <=1.5s settle; reduced-motion snaps. Orbit gestures follow the reference: drag rotate, Shift/right drag pan, wheel/pinch zoom. Pointer travel threshold6px prevents click after drag. Views1/2/3, resetR, nightN, Escape close dialog. Autorotate is opt-in and can be paused; hidden document suspends rendering.

## 7. Depth

Cream floating surfaces with 0 16px 48px rgba(33,72,64,.08), 1px pale border, rounded corners24. Scene uses soft contact shadows, directional light, ambient sky, finite grass parcel and layered tree canopies. No wallpaper screenshot substitutes for geometry.

## 8. Accessibility and source limits

Keyboard user: all view and room tasks available through buttons; visible focus. Touch user: >=44px actions and no required hover. Reduced-motion user: no automatic camera travel. WebGL-unavailable user: source plan and explanation available. Informative photos have alt text. Target text contrast4.5:1 and no horizontal document overflow.

Known source limits, not accepted UI debt: four 120x80 elevations cannot resolve details; furniture, hidden surfaces and landscape are illustrative. This is an architectural visualization, not construction-grade CAD. No accessibility debt accepted.
