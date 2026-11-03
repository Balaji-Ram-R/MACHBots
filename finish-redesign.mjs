import {writeFile,unlink} from 'node:fs/promises';
await writeFile('README.md',`# Robogen Technologies

Full-width Spline canvas hero with grey, white and matte violet styling. Robot rentals, use cases, approved media gallery and local enquiry builder.

## Run
Node 22+. Run npm ci, npm run build, npm run dev. Preview http://127.0.0.1:4173. Run npm test for page, navigation, contact, gallery and canvas integration checks.

## Edit
- build.mjs generates pages and bundles the runtime with esbuild.
- style-new.css is the stylesheet source, copied to dist/style.css on build.
- scene.mjs loads the supplied Spline export into a native canvas, hides the original logo mesh group and renders responsive HTML ROBOGEN lettering behind the transparent scene. Exported interactions are retained, with global cursor events. Pause, reduced-motion and background-tab pause supported.
- dist/app.js manages menu, accessible use-case tabs and enquiry preview/copy.
- content.mjs holds contact details and approved gallery entries.
- dist/assets/nexbot.gltf retains the supplied model; the live hero uses the splinecode export to retain authored interactions.

Scene: https://prod.spline.design/2HkZDmfVk8kWAnOi/scene.splinecode
Character by aximoris, CC BY 4.0. Attribution and adaptation notice in the footer. Spline's runtime badge is preserved. Website changes do not modify the editor document.

## Before public launch
Add real business contact details and approved client media. The form previews and copies enquiries locally; it does not send or confirm a booking. Product references came from the supplied quotation; obtain publication approval. No client deployments are invented. Site remains private and noindex. Spline requires network access and WebGL/WebGPU; rental content remains usable when it fails.
`);
await unlink('redesign.mjs');
