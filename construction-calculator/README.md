# BUILDORA Construction — Cost Calculator

Independent HTML/CSS/JavaScript portfolio demo for a fictional American construction brand.

## Open & use

Double-click **index.html** in a modern browser. No install, backend, build step, internet, API or account is needed. Keep neighboring files together. Change the area, property, renovation, materials and optional packages to update the estimate and chart. Reset restores the example.

Use **presentation.html** or Presentation mode for the compact Fiverr layout at a 1280 × 720 viewport and 100% zoom. The full page also contains a feature list and an expandable explanation of the rates. On phones the form and result stack vertically.

**Print estimate** opens the browser's print dialog. Choose a printer or Save as PDF. The print layout shows project specification, per-package materials and labor, tax, contingency and total. Interactive controls and the chart are omitted from print. The button is disabled while the estimate is invalid.

## Sample rate model

All rates below are USD **per square foot**, applied to the full project area.

| Package | Materials | Labor |
| --- | ---: | ---: |
| Basic Renovation | 18 | 24 |
| Standard Renovation | 32 | 38 |
| Premium Renovation | 55 | 62 |
| Flooring add-on | 8 | 6 |
| Painting add-on | 2 | 4 |
| Electrical Work add-on | 4 | 7 |
| Plumbing add-on | 5 | 9 |

Base renovation covers preparation, carpentry, general installation and site management. The four optional work packages are excluded from that base, avoiding double-counting.

- Material quality multiplies **all package materials**: Essential 0.85, Select 1.00, Signature 1.35.
- Property complexity multiplies **all package labor**: Apartment 1.00, House 1.10, Office 1.20.
- For each package: materials = area × material rate × quality; labor = area × labor rate × complexity. Round each amount to cents before summing.
- Tax = 8% of total materials, rounded to cents. This is a demonstration tax, not a local tax rule.
- Contingency = 10% of materials + labor + tax, rounded to cents.
- Total = materials + labor + tax + contingency.
- The donut segments use those same four totals; accessible text provides their proportions. Cost per unit is total / current displayed area, rounded to cents; this display rate is not used to recalculate the total.

1 sq ft = **0.09290304 m²**. Switching units preserves the canonical physical area and estimate; the converted input is displayed with up to eight decimal places. Limits: 1–100,000 sq ft, equivalent to 0.09290304–9,290.304 m². No silent clamping; invalid area shows a field error and suppresses the price.

Default example: 1,200 sq ft House, Standard Renovation, Select materials, Flooring + Painting. Materials $50,400.00; labor $63,360.00; tax $4,032.00; reserve $11,779.20; **total $129,571.20**.

Permits, design fees, demolition, structural works and local code requirements are excluded. This is an approximate Portfolio Demo, not a commercial offer. Actual project costs and taxes vary. Values are not saved between reloads.

## Files

`calculator.js`: pure calculation and validation model, with browser and CommonJS exports. `app.js`: DOM controls, unit conversion, chart, print itemization, reset and presentation toggle. `styles.css`: layout, accessibility, responsive and print styles. `presentation.css`: compact desktop overrides. Icons and the original logo are local SVGs; no external fonts or libraries are used.
