# setup

```bash
> mkdir vercel-mono-prisma
> cd vercel-mono-prisma
> git init
> pnpm init
> touch .gitignore
```

- add pnpm-workspace.yaml
- add turbo.json
- fill `.gitignore` with standard content

```bash
> mkdir -p apps/web packages/db
> cd packages/db
packages/db> pnpm init
packages/db> mkdir -p src/lib
packages/db> touch src/lib/index.js
```

- add dummy `get_users` in index.js
- package.json: change name to `@repo/db`, add type/main/files fields.

```bash
> cd ../../apps/web
apps/web> pnpm init
```

- add `@repo/db` dependency
- add svelte/-kit/vite devDependencies

```bash
apps/web> mkdir -p src/routes
apps/web> mkdir static
apps/web> touch src\routes\+page.svelte
apps/web> touch src\app.html
apps/web> touch src\hooks.server.js
apps/web> touch svelte.config.js
apps/web> touch vite.config.js
```

- fill files with standard content.
- import `get_users` into `+page.svelte`, and display the result.
- unpack into static: https://toolcool.org/random-favicon-generator/?icon=square-rotated-off&category=Shapes&stroke-width=1.00&stroke-color=1-1-1-1&has-stroke=true&fill-color=255-255-255-1&has-fill=false&bg-color=255-255-255-1&bg-type=2&rotation=0.00&scale=0.80&sharpness=0.00&smoothness=0.00

```bash
apps/web> cd ../..
> pnpm i
> turbo dev --filter web
```

- verify that users are listed.
- stop turbo dev.

```bash
> turbo build
> git add .
> git commit -m "init"
```

- use vscode to push it to github.
