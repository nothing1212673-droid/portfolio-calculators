(function (root) {
  'use strict';
  const SQM_PER_SQFT = 0.09290304;
  const scopes = {
    basic: { name: 'Basic Renovation', material: 18, labor: 24 },
    standard: { name: 'Standard Renovation', material: 32, labor: 38 },
    premium: { name: 'Premium Renovation', material: 55, labor: 62 }
  };
  const materials = { essential: { name: 'Essential', factor: 0.85 }, select: { name: 'Select', factor: 1 }, signature: { name: 'Signature', factor: 1.35 } };
  const properties = { apartment: { name: 'Apartment', factor: 1 }, house: { name: 'House', factor: 1.1 }, office: { name: 'Office', factor: 1.2 } };
  const extras = {
    flooring: { name: 'Flooring', material: 8, labor: 6 },
    painting: { name: 'Painting', material: 2, labor: 4 },
    electrical: { name: 'Electrical Work', material: 4, labor: 7 },
    plumbing: { name: 'Plumbing', material: 5, labor: 9 }
  };
  const cents = n => Math.round((n + Number.EPSILON) * 100);
  function calculate(input) {
    const errors = {};
    if (input.areaSqFt === '' || !Number.isFinite(Number(input.areaSqFt)) || Number(input.areaSqFt) < 1 - 1e-8 || Number(input.areaSqFt) > 100000 + 1e-8) errors.area = 'Enter an area from 1 to 100,000 sq ft (or the m² equivalent).';
    if (!Object.hasOwn(scopes, input.scope)) errors.scope = 'Select a renovation level.';
    if (!Object.hasOwn(materials, input.material)) errors.material = 'Select a material quality.';
    if (!Object.hasOwn(properties, input.property)) errors.property = 'Select a property type.';
    if (!Array.isArray(input.extras) || input.extras.some(key => !Object.hasOwn(extras, key)) || new Set(input.extras).size !== input.extras.length) errors.extras = 'Select valid, unique add-ons.';
    if (Object.keys(errors).length) return { valid: false, errors };
    const area = Number(input.areaSqFt);
    const quality = materials[input.material].factor;
    const complexity = properties[input.property].factor;
    const items = [scopes[input.scope], ...input.extras.map(key => extras[key])].map(item => ({
      name: item.name,
      material: cents(area * item.material * quality),
      labor: cents(area * item.labor * complexity)
    }));
    const material = items.reduce((sum, row) => sum + row.material, 0);
    const labor = items.reduce((sum, row) => sum + row.labor, 0);
    const subtotal = material + labor;
    const tax = Math.round(material * 0.08);
    const contingency = Math.round((subtotal + tax) * 0.1);
    const total = subtotal + tax + contingency;
    return { valid: true, errors: {}, area, items, material, labor, tax, contingency, subtotal, total, perSqFt: Math.round(total / area) };
  }
  const api = { calculate, SQM_PER_SQFT, scopes, materials, properties, extras };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ConstructionCalculator = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
