# Adding goals and tips

Goals and tips are repository content loaded automatically from individual JSON files. No component edit is required.

## Goal

Create `data/goals/<id>.json`:

```json
{
  "id": "photograph-the-moon",
  "title": "Photograph the moon",
  "description": "Practice stable long-lens technique and exposure.",
  "status": "ACTIVE",
  "priority": "MEDIUM",
  "relatedGear": ["tokina-80-200-4"],
  "tags": ["moon", "telephoto"],
  "notes": "",
  "createdAt": null,
  "completedAt": null
}
```

Statuses are `ACTIVE`, `SOMEDAY`, `COMPLETED`, or `BLOCKED`; priorities are `HIGH`, `MEDIUM`, or `LOW`. Do not invent completion dates.

## Tip

Create `data/tips/<id>.json`:

```json
{
  "id": "brace-a-long-lens",
  "title": "Brace a long lens",
  "body": "Support the lens close to its centre of mass.",
  "category": "TELEPHOTO",
  "relatedGear": [],
  "tags": ["stability"]
}
```

Use stable inventory IDs in `relatedGear`. Keep each tip concrete enough to use in the field. Run `npm test` and `npm run build` after editing.
