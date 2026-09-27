# family-tree

Shared, editable family tree.

## Current data safety

The browser editor still keeps every edit in `localStorage` under `family-tree-draft-v1`. The persistence work does not delete or rename that key.

## Vercel shared persistence

This branch includes `/api/tree`, backed by Upstash Redis.

On the Mac mini:

1. Check out `agent/family-tree-initial`.
2. Import/deploy this repository in Vercel.
3. In the Vercel Marketplace, add **Upstash Redis** to the project. Vercel should inject `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
4. Add an `EDIT_PIN` environment variable in Vercel. Do not commit the PIN.
5. Redeploy.
6. Open the Vercel-hosted `/full.html`.
7. Click **Connect shared**, enter the PIN.
8. If the API says the shared tree is not initialized, do this first from the browser that contains the latest local edits. Confirm the upload when prompted.

After initialization, visitors load the shared tree. An editor who connects with the PIN saves changes both locally and to the shared Redis tree.

### Important migration rule

Do not click **Discard local edits** in the ChatGPT browser until its current draft has either been exported or uploaded as the first shared tree.

### GitHub Pages

GitHub Pages has no server-side API. The easiest production setup is to use the Vercel-hosted site. If GitHub Pages must remain the frontend, set `window.FAMILY_TREE_API_BASE` to the Vercel deployment URL and set `ALLOWED_ORIGIN=https://sri-akshat.github.io` in Vercel.
