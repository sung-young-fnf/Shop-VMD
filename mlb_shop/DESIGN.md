# MLB Seongsu · Spatial archive

## 1. Direction and source

Adapt the established Ciudad Jardin interaction system documented in ../test_house/DESIGN.md and ../test_house/evidence/reference-site/ANALYSIS.md (observed 2026-09-07): full viewport diorama, floating destination panel, upper-right environment actions, bottom view controls. This is an existing design-system adaptation. The store has ivory architectural atmosphere, charcoal editorial typography, cobalt selected accents, and visibly metallic/blue/wood fixtures. The signature is the detailed open store section; exterior reveals the tall branded facade. No housing landscape styling transfers.

## 2. Color tokens

--ink #202329; --muted #61666e; --canvas #e8e7e3; --surface #faf9f5; --glass rgba(250,249,245,.94); --border #d3d4d1; --accent #244fc7; --accent-soft #e5eafa; --white #fff; --night #202731; --night-surface #2c3440; --night-ink #f8f7f1; --night-muted #c3cbd6. Scene material colors remain physical source colors.

## 3. Typography

Arial, Malgun Gothic, sans-serif. Masthead32/1 weight900 tracking-.06em; heading22/1.2 weight700; body14/1.6; small12/1.5; eyebrow10/1.5 tracking.16em; micro11/1.5. Monospace coordinates use Consolas. Korean keep-all. Text uses ink/muted, never low-opacity body text.

## 4. Spacing and composition

4px scale:4,8,12,16,20,24,32,40,48. Desktop inset32; header28; destination panel width248 top132. Bottom view bar28 from edge. Radius panel20, buttons12, capsule999. At <=1000px inset16, compact brand24, destinations become horizontal strip below header, metadata card above bottom toolbar. Canvas stays dominant; navigation never depends on hover. Dialog max width960; max height84dvh with internal scroll. Source images preserve aspect ratio and load on first reference-panel open. Source text keeps Korean words intact.

## 5. Primitives and states

At landscape heights<=600 and widths>=600, the navigation becomes a176px left scroll panel below68px; selection becomes a220px right card, leaving the center model visible. Header actions stay onone row; gesture capsule yields its space to the view toolbar.44px targets remain. The initial canvas is sized before camera creation, so loading introduces no artificial refit animation. BFCache restores preserve the scene and controls.

ActionButton: min44px, ivory default, cobalt active, tinted hover, press scale.97, 2px cobalt focus offset3. SegmentedViews: four native pressed-state buttons. DestinationButton: ordinal, Korean zone name, role line, source reference; selected cobalt border/background. FloatingPanel: ivory glass with border and 0 16px 48px rgba(32,35,41,.10) shadow. SelectionCard: live title, detail and source pages. ReferenceDialog: native modal, image navigation, close/Escape and returned focus. SceneStatus: loading text, error source image and retry; unavailable 3D controls hidden. Primitive harness is the running control surface, verified at375/768/1280 before final scene acceptance.

## 6. Motion and interaction

beui.dev/r/tabs/raw read2026-09-07: preserve active-state continuity and reduced-motion zero-duration route; native CSS150ms ease-out and camera exponential damping6/s replace React spring dependency. Selection cameras are interruptible, settle within1.5s. Reduced motion snaps. Orbit drag, right/Shift drag pan, wheel/pinch zoom.6px click travel guard.1–4 views,R reset,N night,C ceiling,Escape dialog close. Rendering stops for hidden document and idle frames.

## 7. Depth and model

Soft shadows on finite plinth, blue-gray steel, rough warm timber and dark expanded mesh. Daylight reveals shape; night retains readable UI and usable illuminated interior. Upper floors are warehouse/support, clearly labeled. Source plan fallback is a readable real source image, never a model surrogate.

## 8. Personas, accessibility and debt

VMD reviewer: inspect nine zones and drawing evidence. Touch reviewer: all destinations/actions >=44px. Keyboard reviewer: semantic buttons, focus visible, same selections as pointer. Reduced-motion reviewer: snap camera. WebGL-unavailable reviewer: real drawing and retry. Source uncertainty: merchandise is illustrative proxy; hidden detailing inferred; p069 counter3300×800×1100 conflicts with p0182600×500, DP-T3 and DP-T2 provisional, lighting color temperature provisional. No accessibility debt accepted. Production browser evidence and independent manager review required before completion.

## 9. Keyboard navigation and visitor walkthrough

Normal exploration: held arrow keys translate the camera and its target together on the floor plane, relative to the current camera. Do not intercept arrows inside dialogs,editable content or scrollable destination controls. Clear held input on blur,visibility loss and modal entry.

WalkToggle uses the existing ActionButton primitive: normal desktop left32/top112 with destinations top168; compact left16/top84 with destinations top140. This preserves the full masthead subtitle and a12px gap below the44px button. Walking uses top80/64 because its subtitle and destination strip are hidden. Short landscape keeps left220/top12 and destinations top68. Active mode is explicitly labelled 걸어보기 and has an always-visible return button plus Escape. Walking hides the destination/selection panels and ordinary view toolbar to expose the eye-level store; returning restores the previous camera and browsing state. Night,ceiling and source controls remain available. The native44px directional pad uses the same pressed-state tokens and offers held pointer/touch movement. A concise help panel uses existing glass,ink,muted,spacing and type tokens; Korean keep-all and safe-area insets apply.

The visitor is original procedural 3D artwork,not a real person likeness or SKU: approximately1.85m with cobalt jacket,charcoal trousers,ivory sneakers and cap,neutral warm skin. Art-only skin #c58d68 and hair #302924 supplement existing scene colors. Shoulder,elbow,hip and knee pivots animate from actual travelled distance; no idle decorative loop. Reduced motion keeps direct user movement but removes gait bob/limb oscillation. No downloaded asset or new runtime dependency.

Walking uses a60-degree field of view and2.3–6m orbit distance,restoring the previous38-degree browsing lens on exit. The masthead gets the existing glass surface with8/12 padding and12 radius during walking so letters stay readable over interior fixtures. A reusable visitor.glb export carries the same original segmented geometry and aWalk animation clip; the app itself uses the procedural factory.

The walking orbit rig is separate from the rendered camera. A ray from the visitor toward the desired camera shortens the camera arm at visible obstacles; below1.35m clearance it switches to a1.65m eye-level first-person view and hides the visitor body. The help panel names this automatic change. Orbit intent stays stable so holding a direction cannot flip movement when the wall shortens the camera arm. The avatar reappears when the third-person view has clearance.

Walking mechanics are a novel scene control,not a tab animation: camera-relative arrow/WASD movement,diagonal normalization,1.7m/s walking,collision probes against actual floor-level model meshes and1F bounds,third-person OrbitControls look-around. The beui tabs source was re-read for consistent active state and reduced-motion semantics; native CSS150ms remains the UI mechanism. Walking does not climb to2F/3F. Shadow-map invalidation during movement keeps the visitor shadow current; ordinary static exploration retains cached shadows. Verification includes walking entry/exit,all four directions,collision,blur/modal release,touch,orientation,BFCache,keyboard focus and original view/reset behavior.
