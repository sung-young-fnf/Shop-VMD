# Cap material study

## 0. Reference and scope
The supplied navy cap photograph is the material and silhouette reference. The interface is an ancillary inspection instrument: pale studio, compact Korean controls, two equal live objects comparing procedural fabric A with photographic textures B. No marketing content. The parent task owns model fidelity and final browser visual QA.

## 1. Intent and users
Help a material reviewer inspect fabric at grazing angles, compare the source camera, and examine construction. Keyboard users must reach all controls without interacting with the canvas.

## 2. Palette and depth
Canvas #eeede9; panel #faf9f6; text #252c32; muted #606870; border #d9d9d3; accent #233b54; active #e3e9ed; white #ffffff. Flat interface surfaces; physical light and shadow supply depth inside the canvas.

## 3. Type
System sans with Malgun Gothic Korean fallback. Title 20px, section text 13px, labels 12px, eyebrow 10px. Korean word-break keep-all. Tabular numeric outputs.

## 4. Layout
4px spacing unit; 8/12/16/24/32px spacing. Desktop header 72px, control rail 280px. Studio fills remaining viewport with two equal columns separated by the existing border token. Each canvas has a 13px label at 24px inset. At 1024px the rail stacks below a 64vh comparison, minimum 360px; below 520px the two canvases stack vertically, each 46vh and minimum 280px. Capture mode hides the instrument chrome and renders one query-selected variant in a viewport-filling white studio.

## 5. Primitives and states
Native buttons, select, checkbox, and labeled ranges. Buttons minimum 36px tall with 4px radius, bordered rest state, active tint, accent focus outline. Radio-like view/light button groups expose aria-pressed. Source image has fixed aspect ratio and alt text. Error status is readable above the canvas. Selection output uses aria-live. Reused comparison panes carry A/B text labels; camera gestures in either pane synchronize the other, and every surface/light/explode control applies to both models. Click selection has a keyboard-equivalent native select.

## 6. Motion
Render on demand. Rotation is opt-in and defaults off, including reduced motion. Camera presets update immediately for repeatable inspection. No decorative animation.

## 7. Responsive and accessibility
No horizontal scrolling at 375px. Panel controls remain native and keyboard operable. Canvas has descriptive accessible name and keyboard view presets outside it. Contrast follows dark text on pale backgrounds. Touch targets use 36px minimum with separated rows.

## 8. Evidence and debt
Capture script records repeatable source, four orthogonal, and material close-up views plus runtime model statistics and console errors. Parent runs final visual QA after the model is available. No fidelity or performance pass is claimed by this interface scaffold.


Lighting comparison adds 색상만: real unlit material mapping for albedo inspection, with the same geometry/camera. Studio floor tracks measured model minimum Y; hidden while exploded so the construction stays inspectable.
