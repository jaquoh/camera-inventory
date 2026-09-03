# Vintage Lens Plan

A repository-backed photography inventory, backpack planner, and Markdown field notebook with a restrained retro adventure-game interface.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The production bundle is fully static:

```sh
npm run build
```

## Content model

- `data/inventory/`: one validated JSON record per real or desired item
- `data/notebook/`: Markdown pages with small frontmatter headers
- `data/goals/`: one JSON record per goal
- `data/tips/`: one JSON record per field tip
- `public/assets/equipment/`: reference photographs and finished equipment art
- `public/notebook/images/`: diagrams and photographs used by notebook pages

Repository JSON remains the canonical seed content. Inventory changes made through the app are stored as browser-local overrides, including added records and deletion markers; the backpack is also stored locally. This keeps the static app fully usable without a server while allowing future repository updates to merge underneath local changes.

## Quality checks

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

See [Adding equipment](docs/ADDING_EQUIPMENT.md), [adding notebook content](docs/ADDING_NOTEBOOK_CONTENT.md), and [adding goals and tips](docs/ADDING_GOALS_AND_TIPS.md).
