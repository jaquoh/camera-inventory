# Adding equipment

Equipment is loaded automatically from JSON files below `data/inventory/`. Adding or editing gear must not require a UI change.

## 1. Create the record

Copy a similar item into the appropriate folder and give it a stable lowercase ID, for example `data/inventory/lenses/smc-takumar-55-18.json`. Keep the filename and `id` aligned.

Required shape:

```json
{
  "id": "maker-model",
  "category": "LENS",
  "manufacturer": "Verified maker",
  "model": "Verified model",
  "displayName": "Verified maker and model",
  "ownershipStatus": "OWNED",
  "collectionRole": "KEEPER",
  "mount": "M42",
  "compatibility": {},
  "acquisition": {
    "price": null,
    "currency": "EUR",
    "date": null,
    "source": null,
    "condition": null,
    "notes": null
  },
  "specifications": {},
  "specificationSources": {},
  "description": "",
  "personalNotes": "",
  "tags": [],
  "referenceImages": [],
  "thumbnail": null,
  "detailImage": null,
  "links": []
}
```

Allowed values are defined in `src/domain/types.ts`; runtime validation is in `src/data/schema.ts`. Omit unknown optional facts or use `null` where supported. Never fill a gap by guessing.

Physical focal length belongs in `specifications.focalLengthMin` and `focalLengthMax`. Do not replace it with a crop-equivalent number—the UI calculates equivalent framing from the camera crop factor.

Attach a source to an important fact without putting citation data inside the value:

```json
"specificationSources": {
  "weight": [{ "label": "Manufacturer manual", "url": "https://example.com/manual" }]
}
```

## 2. Add real reference photographs

Create this structure:

```text
public/assets/equipment/<item-id>/
  reference/
    photo-01.jpg
    photo-02.jpg
  thumbnail.png
  detail.png
```

Photograph the actual copy from useful angles in even light. Include distinguishing markings, controls, rings, grip shape, mount, tripod collar, and wear that should survive the pixel-art translation. Do not commit private EXIF location data.

Add the browser paths to the record:

```json
"referenceImages": ["/assets/equipment/<item-id>/reference/photo-01.jpg"],
"thumbnail": "/assets/equipment/<item-id>/thumbnail.png",
"detailImage": "/assets/equipment/<item-id>/detail.png"
```

## 3. Generate artwork only from those references

- `thumbnail.png`: exactly **160 × 136 pixels**, with a transparent background. Compose the object for that canvas; do not export a loose crop around it.
- `detail.png`: larger pixel-art rendering with recognizable proportions and controls.
- Preserve the real object's distinctive geometry and markings.
- Do not invent details hidden by every reference photograph.
- Review both assets beside the photographs before updating the JSON paths.

The inventory uses fixed **224 × 224 pixel slots** and displays `thumbnail.png` at its native 160 × 136 size. It is never stretched, shrunk, or cropped to fit a responsive card. Keep a small transparent safety margin inside the canvas, but let the equipment fill most of it so the art—not its label—remains the dominant part of the slot. Use hard pixel edges and do not include a background, frame, label, status marker, or shadow in the artwork; the interface supplies those consistently.

The thumbnail and detail image are separate compositions. Do not derive the inventory thumbnail by letting the browser scale or crop the detail image.

Until both images are ready, leave their fields `null`. The app deliberately shows a shared “Reference photos needed” silhouette and does not pretend it depicts the item.

## 4. Verify

Run `npm test`, `npm run lint`, and `npm run build`. Open the item in Inventory and check its label, state, role, mount, facts, and both image sizes.
