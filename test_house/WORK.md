# House experience implementation

User request: inspect Ciudad Jardín, reconstruct the supplied house in an interactive Three.js page, and develop reusable skills from the implementation.

1. Reference inspection: completed. Six local images viewed and site browser behavior tested; evidence/reference-site/ANALYSIS.md.
2. Reconstruction: completed. Procedural house with actual openings and furnished cutaway, four-direction roof corrections, static batching; evidence/model/implementation-status.md.
3. Skills/harness: completed. Official img2 0.2.3 installed; local house plugin linked, 7 integration tests pass, doctor and sync clean. Guide at ~/.codex/skills/threejs-house-experience; official base skill unmodified.
4. Verification: completed. Production build, 10 browser checks, all 29 capture hashes, day/night axe, real WebGL fallback, both official house gates and seven plugin gate tests pass. Final independent functional and visual/CJK reviewers both PASS on manifest 9e9b1cde71b1f8fbb960f7c1520325fbfdefbd844565523256ec512850f5ad96. Mobile startup performance remains a documented limitation; no Lighthouse100 claim.

Scope: test_house is a new app; reference images stay intact. The enclosing parent Git tree has unrelated changes outside this project.
