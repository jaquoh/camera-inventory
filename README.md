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

Canonical content stays in Git. Only the current backpack is stored in the browser's `localStorage`.

## Quality checks

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

See [Adding equipment](docs/ADDING_EQUIPMENT.md), [adding notebook content](docs/ADDING_NOTEBOOK_CONTENT.md), and [adding goals and tips](docs/ADDING_GOALS_AND_TIPS.md).
