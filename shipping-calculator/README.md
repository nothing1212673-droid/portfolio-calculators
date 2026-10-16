# NEXUS Logistics — Shipping Cost Calculator

Independent HTML/CSS/JavaScript portfolio demo for a fictional logistics brand.

## Open

Double-click **index.html** in a modern browser. No install, backend, build step, API, internet connection or account is required. Keep all files together. Open **presentation.html** for the compact Fiverr layout, or use the Presentation mode button. Designed for a 1280 × 720 viewport at 100% browser zoom; mobile layouts stack the form and result.

## Features

Eight sample countries, three delivery services, dynamic pricing, automatic volumetric and billable weight, optional insurance with declared value, delivery estimates, cost breakdown, input validation, reset, reduced-motion support and keyboard accessible controls. Expand “How the demo rates work” for the rate model.

## Sample rate model

All amounts are USD. One parcel per estimate.

| Lane | Economy base | Economy / kg |
| --- | ---: | ---: |
| Same country | 9.00 | 2.20 |
| Same region | 16.00 | 3.20 |
| Across regions | 24.00 | 4.80 |

Regions: Americas (US, Canada), Europe (UK, Germany, France), Asia Pacific (Japan, Singapore, Australia). Service multiplier: Economy 1, Standard 1.35, Express 1.90.

1. Volumetric kg = length × width × height in cm / 5,000.
2. Billable kg = greater of actual / volumetric kg, rounded **up** to 0.5 kg.
3. Multiply lane base and per-kg rate by service multiplier; round each to cents.
4. Weight charge = billable kg × adjusted rate, rounded to cents.
5. Fuel = 12% of base + weight charge, rounded to cents.
6. If selected, protection = 1% of declared value, minimum $5, rounded to cents.
7. Total = base + weight charge + fuel + protection. No duties or taxes are modeled.

Sample transit times in business days, **domestic / regional / intercontinental**:

| Service | Domestic | Regional | Intercontinental |
| --- | --- | --- | --- |
| Economy | 3–5 | 5–8 | 10–16 |
| Standard | 2–3 | 3–5 | 6–9 |
| Express | 1–2 | 2–3 | 2–4 |

Limits: weight 0.1–1,000 kg; each dimension 1–300 cm; insured value $100–$50,000. Decimal values are supported. Actual carrier size limits, item eligibility, customs and holidays are not modeled. Uninsured shipments do not validate the hidden declared-value input. Invalid fields suppress the estimate until corrected.

Default example: US → UK, Standard, 5 kg, 40 × 30 × 25 cm, declared value $1,500. Dimensional/billable weight: 6 kg. Base $32.40 + weight $38.88 + fuel $8.55 + protection $15 = **$94.83**.

## Files

`calculator.js` is the pure calculation model (browser global and CommonJS export). `app.js` connects controls to the model. `styles.css` provides the main layout; `presentation.css` provides compact desktop overrides. All icons and the logo are local SVGs. No external fonts, images or libraries are loaded.

This is a Portfolio Demo. Rates and time ranges are illustrative, not real carrier offers. Values are not saved between page reloads.
