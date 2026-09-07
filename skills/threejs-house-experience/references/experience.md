# House experience and browser evidence

## Website reference extraction

Use an actual browser for a WebGL reference, wait for its usable entry state, then interact. Record opening state, entered scene, camera gestures, keyboard controls, focus/hover feedback, and mobile behavior. Read DOM computed styles for interface tokens. A blank canvas under a headless software renderer is an environment limitation until investigated, not evidence of a blank reference design. Do not inspect unrelated browser profiles or credentials.

## Spatial website

Keep a large canvas as the primary surface with a small, legible interface. Give exterior, section and plan views distinct states. Always show the current mode, the selected room, and a reset path. Keyboard-accessible view buttons and room lists complement raycasting; key spatial tasks must not require precise dragging.

Raycast on pointer release only if pointer travel stayed below the drag threshold. Otherwise orbiting accidentally selects a room. Respect current mode: roof-hidden room floors can receive hits, opaque roofs must not be clicked through. Frame a room from its center and bounds, not a hardcoded camera for every room. Use a world-to-screen projection for DOM room labels and suppress offscreen/occluded labels.

Review every room preset, not just one representative room. A uniform camera offset placed the Flex Room camera behind the house's tall chimney, so selection worked while the selected room was invisible. Keep room-specific clear-view overrides in reconstruction data where large persistent obstructions require them; verify the selected room's visible footprint in the actual frame.

Manage one render loop, cancel on dispose, cap device pixel ratio, pause on hidden documents, and render only while dirty or moving. Camera damping needs a bounded settling window after input. Reuse geometry/material, and dispose both when replacing the scene. Keep controls responsive to interrupt an in-flight camera transition. Honor reduced motion by snapping programmatic camera moves and disabling autorotation by default.

Clamp programmatic camera destinations to the same distance limits as OrbitControls before interpolating. In the house implementation, a small room requested a radius below the control's 9m minimum; runtime radius stayed exactly 9 while the animation's `moving` flag remained true indefinitely. Increasing the timeout cannot repair this. Test small-room presets and repeated zoom-in/out at both distance limits, including reduced motion.

## Responsive and fallback

On mobile move detail content to a lower sheet or regular page flow so it does not cover the entire model. Keep actions at least 44px tall. Use natural Korean line breaking (`word-break: keep-all`) where appropriate. A scrollable sheet needs a `min-height: 0` and a defined scroll owner. Plan images retain their aspect ratio and offer a zoom/open-original action if labels become unreadable.

If WebGL creation fails or context is lost, display a descriptive failure panel and usable reference plan; never leave an endless loader or falsely claim a 3D scene is ready. Start with static semantic HTML while the scene module loads.

## Evidence checklist

Drive the production build at 375, 768 and 1280+ widths. Test exterior rotation and zoom; section; every room navigation; plan comparison open/close and escape/focus restoration; day/night; exploded/reset; keyboard shortcuts and reduced motion; resize and WebGL failure. Capture front/right/rear/left and overhead separately from UI screenshots.

Record console/page errors, viewport overflow, meaningful accessibility violations, renderer triangle/draw-call counts, and tested user scenarios. Synthetic performance audits and actual frame measurements describe different behavior; report their limits. Never claim a Lighthouse score that was not measured or turn off the real 3D experience to improve it.
