# Measured houses, not flat facade props

Inspect every source. Record dimensions, role and confidence; small elevation thumbnails support silhouettes, not precise mullions. Establish front from the entrance and porch; document filename/drawing direction conflicts. Use a readable plan for footprint and room adjacency, photographs for materials, and elevations for roof shape.

Use metres, Y-up, and one explicit plan-pixel transform. Calibrate horizontal and vertical annotations separately. Feet/inches convert as `(feet + inches/12) * 0.3048`; distinguish clear room dimensions from wall extents. Record annotations, pixel spans and derived scales so disagreement remains reviewable. Furniture and concealed structure need explicit inference labels.

Keep physical assemblies independently addressable: foundation, envelope, porch, roof and interiors. Walls with openings require piers, sills and lintels or actual holes. Window planes on opaque walls fail roof-off inspection. Use pitched slabs and gable infill with consistent winding; a double-sided material does not repair inverted geometry. Porch roofs meet below the main eave rather than hiding the facade. Instancing fits repeating battens, seams and mullions.

Capture front/rear/left/right plus overhead before detailing. Confirm the garage side, rear wing, ridge axis and porch support contacts. Roof cutaway must also remove gable infill and ceilings hiding interiors. Save original transforms and restore them on reset. Selectable room IDs come from one room inventory shared by geometry and navigation.

Judge reference fidelity separately from automatic checks. Browser evidence must come from the running WebGL scene: finite vertex positions, positive bounds, actual assembly names and room IDs, plus exercised cutaway, explosion, selection, reset, night and keyboard behavior. The inspiration site's camera and atmosphere may transfer; its proprietary city mesh and branding do not become house evidence.
