# Robogen Technologies

Robot rental showroom with a full-width local Three.js robot canvas. Grey, white and matte violet design.

Run npm ci, npm run build, npm run dev. Preview http://127.0.0.1:4173. Run npm test for generated page, navigation, contact, gallery and renderer checks.

- build.mjs generates pages and bundles robot-scene.mjs with esbuild.
- robot-scene.mjs renders dist/assets/nexbot.gltf using Three.js. The supplied GLTF has geometry without Spline materials or events: black physical materials, studio lighting and cursor-following head rotation are recreated in this renderer. No Spline runtime, badge, or remote scene requests. Pause, reduced-motion, responsive framing and visibility controls included.
- style-new.css is the design source, copied to dist/style.css.
- dist/app.js handles menu, accessible tabs and enquiry preview/copy.
- content.mjs holds business details and approved client gallery entries.

Original robot character by aximoris under CC BY 4.0; attribution and adaptation notice retained in the footer.

Contact details and client media await owner approval. The enquiry builder copies locally and does not send or confirm bookings. Site remains private and noindex. Model requires WebGL; rental content and navigation remain usable if it fails.
