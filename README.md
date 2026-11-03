# Robogen Technologies website

Three primary pages: Explore Robots, Robots in Action, and Contact. Includes privacy and a custom 404. This is a static, dependency-free implementation with a small Node build script and plain HTML/CSS/JavaScript. It adapts the plan's static architecture without introducing a framework or package installation.

## Run

Use Node 20 or newer:

```sh
node build.mjs
node --test tests/*.test.mjs
node server.mjs
```

Open http://127.0.0.1:4173. The server binds only to loopback. `dist/` is the deployable static directory. `build.mjs` generates HTML; edit page markup there, not generated HTML. CSS and JavaScript live in `dist/style.css` and `dist/app.js` and are retained by the build.

## Business content

Edit `content.mjs` to set the real email, phone and WhatsApp number. WhatsApp uses country code plus number. Empty contact channels stay hidden; the page offers a functional preview/copy brief and explicitly says no enquiry has been sent. The builder does not store personal data or make network requests.

Add approved performances to `performances` in `content.mjs`. Each entry needs `title`, `category`, `robot`, `description`, `type` (`image` or `video`), `src`, `alt`, and `approved: true`. Videos should also have a `poster` and a WebVTT `captions` file for meaningful speech. Use relative same-origin files under `/assets/` for this initial implementation. Native playback is click-to-play; starting a video pauses other players. No fake media is published when the list is empty.

## Hero

The hero embeds the actual NEXBOT Community preview by aximoris. Its iframe URL was read from the supplied Community page, not derived or guessed. The page displayed a CC BY 4.0 license; creator, source, license and Spline links are retained beneath the scene. This is a concept character, not either rentable Unitree platform.

`business.splinePreview` in content.mjs controls the preview URL. Desktop loads the scene automatically unless reduced motion is requested. Mobile loads only after the visitor chooses Load interactive robot. Pause 3D removes the iframe. The original generated render is the paused fallback, not presented as the live NEXBOT model. A second generated illustration remains in the customization section.

The cross-origin preview cannot be edited from this website: camera, scene background, objects and materials require an editable remix in the company's Spline account. The Spline MCP connector was not available in this session. For an owned production export, use the account's actual supported export URL and adjust the integration as needed. Never derive a .splinecode URL from a Community ID. CSP permits the observed app.spline.design frame origin only. An iframe load event does not prove the WebGL scene rendered; verify it visually.

## Before public launch

- Confirm exact model variants, descriptions and permitted activities with the business.
- Add and verify the actual business contact destination.
- Review the proposed wordmark/icon with the owner; this is a new visual treatment, not the supplied legal logo.
- Confirm publication rights for robot photos and client media. Source extraction is not a rights grant.
- Replace the gallery empty state by adding approved media when available.
- Review privacy text with the actual contact and hosting setup.
- Current pages use `noindex,nofollow` and robots.txt disallows crawling. Remove those restrictions only when public content is approved; add a sitemap for the final hostname then.
- Check all three pages, direct links, mobile navigation, keyboard, zoom, reduced motion, enquiry editing/copy fallback and video captions.

## Hosting and handover

The Sites manifest preserves the private preview identity. Do not reuse that ID in a new unrelated project. For a later independent static host, upload `dist/` using the chosen host's documented workflow, set the final origin in `content.mjs`, and rebuild. No paid services or dependencies are required by this source.

Keep source, content, original asset approvals and a known-good release together. To roll back, redeploy the previous saved version. To disable decorative hero movement, remove the final pointer-response block in app.js. Replacing the hero with a new image only requires updating the asset path and dimensions in build.mjs.

## Asset provenance

- `dist/assets/r1.webp` and `g1.webp`: product imagery extracted from the supplied rental quotation, reformatted as WebP. Business must confirm publication rights.
- `dist/assets/hero-robot.webp`: original concept generated with the built-in image-generation tool; not a product photograph or Spline export. Prompt preserved in `hero-prompt.txt`.
- `dist/assets/mark.svg`: proposed vector brand mark created for this prototype.
- No fabricated client footage, endorsements, ratings, contacts or availability claims.

No external fonts, analytics or runtime libraries are loaded. System fonts keep the site lightweight and independent of font services.
