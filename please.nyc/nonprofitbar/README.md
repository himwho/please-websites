# Nonprofit Bar NYC

Public concept site for **Nonprofit Bar NYC**, deployed as [`nonprofitbar.please.nyc`](https://nonprofitbar.please.nyc).

This is a static Vite + React page. It uses the same AWS S3 + CloudFront + Route 53 path as the rest of the Please sites, with one difference: it is a **subdomain of `please.nyc`**, so it does not need its own hosted zone.

## Local

```bash
cd please.nyc/nonprofitbar
npm ci
npm start
```

Edit `src/App.tsx` (copy and cost-meter demo) and `src/styles.css`.

## Production build

```bash
npm run build
```

Output is in `dist/`. From the repo root:

```bash
make nonprofitbar
```

That runs `npm ci`, builds the site, and syncs `dist/` to `s3://please-nonprofitbar.please.nyc-public`. It does **not** ship with `make please`; the parent `please.nyc` sync excludes this folder so the React source never lands on the apex site.

## AWS (first time)

Follow the root README hosting steps, using domain `nonprofitbar.please.nyc` and bucket `please-nonprofitbar.please.nyc-public`. Because `please.nyc` already has a hosted zone:

1. Create the S3 bucket, public-read policy, and static website hosting.
2. Request (or extend) an ACM certificate that includes `nonprofitbar.please.nyc`.
3. Create a CloudFront distribution for the bucket website origin, with that certificate and the CNAME `nonprofitbar.please.nyc`.
4. In the **existing** `please.nyc` hosted zone, add an alias A record for `nonprofitbar` pointing at that distribution. Do not create a second hosted zone.

## Before a public launch

1. Confirm `hello@please.nyc` is the right inbox for the role CTAs in `src/App.tsx`.
2. The cost meter is a client-side demo. A live meter should fetch a read-only summary such as:

```json
{
  "month": "2026-08",
  "targetCents": 6400000,
  "recognizedRevenueCents": 3884000,
  "verifiedAt": "2026-08-20T14:00:00Z"
}
```

3. Add privacy, accessibility, and terms pages if an operating entity exists.
4. Complete legal review of nonprofit structure, alcohol licensing, public price claims, and financial disclosures.
