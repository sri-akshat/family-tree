# family-tree

Shared, editable family tree with Postgres persistence.

## Canonical seed

`data/family-tree-seed.json` is the exported tree supplied by Akshat and is the initial database source of truth. It includes the browser edits already captured in that export, including Neelam + Ashish Kumar Dixit -> Amiya and Avika.

## Database

The app stores the current complete tree as JSONB in one Postgres row. This keeps the existing nested tree model intact while making it centrally persistent.

Schema: `db/schema.sql`

API: `api/tree.js`

Seed: `scripts/seed.mjs`

## Mac mini / Vercel setup

1. Checkout/pull `main`.
2. Run `npm install`.
3. Create/link a Vercel project.
4. Provision Neon Postgres from Vercel Marketplace.
5. Pull/set `DATABASE_URL` locally.
6. Run `npm run db:seed`. This creates the table if needed and UPSERTs `data/family-tree-seed.json` into `family_tree.id = 1`.
7. Set `EDIT_PIN` in Vercel. Never commit the PIN.
8. Deploy/redeploy.
9. Open `/public/full.html`. The frontend in `public/` GETs the canonical tree from SQL. Editors use **Connect shared** and the PIN; edits PUT back to SQL.

## Local safety

The editor still writes `family-tree-draft-v1` in localStorage as a local backup. SQL is the shared source after deployment.

For a GitHub Pages frontend pointing at a Vercel API, set `window.FAMILY_TREE_API_BASE` to the Vercel deployment URL and set `ALLOWED_ORIGIN=https://sri-akshat.github.io` in Vercel.


## Repository layout

```
api/                  Vercel serverless API
data/                 Canonical SQL seed JSON
db/                   Database schema
scripts/              Database/setup scripts
public/                Static web application
  assets/              Frontend JS and CSS
  data/                Browser fallback tree snapshot
index.html             Thin redirect for GitHub Pages
package.json           Runtime dependencies/scripts
vercel.json            Vercel configuration
```
