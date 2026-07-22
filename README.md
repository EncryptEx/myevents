# MyEvents & Venues

A statically exported Next.js site documenting the hackathons, congresses,
competitions, and community events I have attended, mentored, or organized.

The site uses the Next.js App Router, TypeScript, and Mapbox GL JS. Event content
is rendered from the JSON files in `src/data`, so it needs no database or server
runtime.

## Requirements

- Node.js 22.13+
- npm 11+

## Local development

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The public Mapbox token from the original site is retained as a fallback. To use
a different token, copy `.env.example` to `.env.local` and set
`NEXT_PUBLIC_MAPBOX_TOKEN`.

## Quality checks

```sh
npm run lint
npm test
npm run build
```

`npm run build` creates a fully static site in `out/`. Run `npm start` after a
build to preview that production output locally.

## Deploy to Vercel

1. Import this repository into Vercel.
2. Keep the detected framework preset as **Next.js**.
3. Optionally add `NEXT_PUBLIC_MAPBOX_TOKEN` in the project environment variables.
4. Deploy. No output-directory or build-command override is needed.

The `output: "export"` setting in `next.config.ts` means the application has no
PHP or Node.js server dependency at runtime.

## Updating events

Edit the relevant file in `src/data` and add event images under
`public/static/img`. Image paths in the existing JSON remain compatible in the
form `./static/img/example.png`.

Run `npm test` before committing. The test suite checks date ordering, required
fields, coordinates, and warns about referenced image files that have not been
added yet.

## Docker

The optional Docker setup builds the same static export and serves it with Nginx:

```sh
docker compose up --build
```

Open [http://localhost:8084](http://localhost:8084).
