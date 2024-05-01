
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [setup](#setup)
  - [head over to vercel and import the repo](#head-over-to-vercel-and-import-the-repo)
    - [configure](#configure)
    - [verify that everything runs ok](#verify-that-everything-runs-ok)
- [Database](#database)
  - [Create a Postgres database](#create-a-postgres-database)
- [Error 1](#error-1)
  - [Solution 1](#solution-1)
- [Prisma](#prisma)
  - [Where to install prisma..?](#where-to-install-prisma)
  - [Where should the prisma.schema file live?](#where-should-the-prismaschema-file-live)

<!-- /code_chunk_output -->



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

## head over to vercel and import the repo

### configure
![alt text](image.png)

### verify that everything runs ok
![alt text](image-1.png)


# Database
## Create a Postgres database
(from vercel dashboard)
![alt text](image-2.png)

Following the SvelteKit instructions:
```bash
> npm i -g vercel
> vercel link
vercel-mono-prisma❱ vercel link
Vercel CLI 33.7.0
? Set up “c:\srv\work\vercel-mono-prisma”? yes
? Which scope should contain your project? thebjorn hobby team
? Found project “thebjorn42/vercel-mono-prisma”. Link to it? yes
✅  Linked to thebjorn42/vercel-mono-prisma (created .vercel and added it to .gitignore)
> vercel env pull .env
> pnpme add @vercel/postgres --filter web
```

- use pgAdmin to verify connection parameters.
- create a cart table to fit the `@vercel/postgres` example.
- add apps/web/src/routes/+page.server.js etc. according to docs.

# Error 1
```bash
> turbo dev --filter web
...
web:dev:   VITE v5.2.10  ready in 1074 ms
web:dev:
web:dev:   ➜  Local:   http://localhost:5176/
web:dev:   ➜  Network: use --host to expose
web:dev: VercelPostgresError: VercelPostgresError - 'missing_connection_string': You did not supply a 'connectionString' and no 'POSTGRES_URL' env var was found.
web:dev:     at createPool (file:///C:/srv/work/vercel-mono-prisma/node_modules/.pnpm/@vercel+postgres@0.8.0/node_modules/@vercel/postgres/dist/chunk-WDBQYBZQ.js:161:11)
web:dev:     at Object.apply (file:///C:/srv/work/vercel-mono-prisma/node_modules/.pnpm/@vercel+postgres@0.8.0/node_modules/@vercel/postgres/dist/chunk-WDBQYBZQ.js:215:16)
web:dev:     at load (C:\srv\work\vercel-mono-prisma\apps\web\src\routes\+page.server.js:5:20)
web:dev:     at Module.load_server_data (C:\srv\work\vercel-mono-prisma\node_modules\.pnpm\@sveltejs+kit@2.5.7_@sveltejs+vite-plugin-svelte@3.1.0_svelte@5.0.0-next.120_vite@5.2.10_@typ_bs34xdsk7mkkgs2ku7c2vw6ru4\node_modules\@sveltejs\kit\src\runtime\server\page\load_data.js:61:41)
web:dev:     at C:\srv\work\vercel-mono-prisma\node_modules\.pnpm\@sveltejs+kit@2.5.7_@sveltejs+vite-plugin-svelte@3.1.0_svelte@5.0.0-next.120_vite@5.2.10_@typ_bs34xdsk7mkkgs2ku7c2vw6ru4\node_modules\@sveltejs\kit\src\runtime\server\page\index.js:140:19 {
web:dev:   code: 'missing_connection_string'
web:dev: }
```

Building and deploying runs without errors when pushing to vercel, but no data is displayed from the database.
Manually setting POSTGRES_URL in the environment (even uri-encoded) does not connect.
```
web:dev: Error: Database connection string provided to `neon()` is not a valid URL. Connection string: "postgres://defaul...
```

## Solution 1
The following changes are needed to get this running locally:

```bash
diff --git a/apps/web/src/routes/+page.svelte b/apps/web/src/routes/+page.svelte
index 162f558..98e05d4 100644
--- a/apps/web/src/routes/+page.svelte
+++ b/apps/web/src/routes/+page.svelte
@@ -17,15 +17,8 @@
-    {#each data.cart as { name, user_id } (name)}
+    {#each data.cart.rows as {name, user_id} (name) }


diff --git a/apps/web/vite.config.js b/apps/web/vite.config.js
index e434d9f..6ef541e 100644
--- a/apps/web/vite.config.js
+++ b/apps/web/vite.config.js
@@ -1,9 +1,14 @@
 import { sveltekit } from '@sveltejs/kit/vite';
-import { defineConfig } from 'vite';
+import { defineConfig, loadEnv } from 'vite';


-export default defineConfig({
-    plugins: [
-        sveltekit()
-    ]
-});

+export default defineConfig(({mode}) =>        {
+     if (mode === 'development') {
+         const env = loadEnv(mode, './../../.env', '');
+     }
+     return {
+         plugins: [
+             sveltekit()
+         ]
+     }
+})
```

# Prisma

docs
:  https://vercel.com/docs/storage/vercel-postgres/using-an-orm#prisma

## Where to install prisma..?
Obviously I want the database code to live in the `packages/db` package

Copilot completion to the previous sentence... hmmm: , but prisma needs to be installed in the `apps/web` package.

**Note:** the command in the docs is wrong (according to: https://turbo.build/repo/docs/handbook/tools/prisma). It should be:

```bash
> pnpm add @prisma/client --filter @repo/db
> pnpm add -D prisma --filter @repo/db
```

## Where should the prisma.schema file live?
Vercel docs doesn't say...
.. heading over to the Prisma docs... (https://www.prisma.io/docs/getting-started/quickstart)

- ah.. there is a missing `prisma init` step in the vercel docs that creates the schema.prisma file
- but before that, this `public-hoist-pattern[]=*prisma*` should be added to the root .npmrc file (I'm assuming it is the monorepo root, since this is the turborepo docs...)
- "Run your package manager's install step to install the new dependencies."


```bash
vercel-mono-prisma❱ pnpm i
Scope: all 3 workspace projects
? The modules directory at "C:\srv\work\vercel-mono-prisma\node_modules" will be removed and reinstalled from scratch. Proceed? (Y/n) » true
```

(sigh, this takes a good 30 minutes on my quite fast machine...)

There seems to be multiple issues with running prisma in a monorepo, most of which have been open for a very long time... (I'm getting bad vibes here...):
- https://github.com/prisma/docs/issues/1288
- https://github.com/prisma/prisma/issues/12535
- https://github.com/prisma/prisma/issues/9726

```bash
> cd packages/db
packages/db> npx prisma init
packages/db> cp ../../.env .
packages/db> npx prisma db pull
```

- update prisma.schema, adding a `User` model
- update src/lib/index.js to use the prisma client and +page.server.js to use the new `get_users` function.
- clean up +page.svelte to display the users.

```bash
packages/db> npx prisma push
packages/db> npx prisma generate
packages/db> turbo dev --filter web
```

- use pgAdmin to verify that the `User` table has been created.
- manually add some rows to the `User` table.
- reload the browser page, and verify that the users are displayed.


