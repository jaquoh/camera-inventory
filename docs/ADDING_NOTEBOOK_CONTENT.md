# Adding notebook content

Add one Markdown file below a topical folder in `data/notebook/`. The filename is organizational; the frontmatter `id` is the stable internal identity.

```md
---
id: atmospheric-distortion
title: Atmospheric Distortion
tab: TELEPHOTO
order: 2
summary: Why distant subjects can look soft even with correct focus.
---
# Atmospheric Distortion

Write the field note here.
```

The app supports headings, lists, tables, blockquotes/callouts, code blocks, external links, and internal notebook links. Link to another page by ID:

```md
[Review long-lens fieldcraft](#long-lens-fieldcraft)
```

Put repository images in `public/notebook/images/` and use an optional Markdown title as the visible caption:

```md
![Heat shimmer over a distant roof](/notebook/images/heat-shimmer.jpg "Atmospheric shimmer at 500mm")
```

Keep observations distinct from verified technical facts. Attach a normal Markdown source link when a fact needs provenance. Run `npm test` and `npm run build` after editing.
