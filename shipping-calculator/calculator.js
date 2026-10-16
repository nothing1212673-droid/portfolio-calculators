(function (root) {
  'use strict';
  const countries = {
    US: { name: 'United States', region: 'Americas', code: 'USA' },
    CA: { name: 'Canada', region: 'Americas', code: 'CAN' },
    GB: { name: 'United Kingdom', region: 'Europe', code: 'GBR' },
    DE: { name: 'Germany', region: 'Europe', code: 'DEU' },
    FR: { name: 'France', region: 'Europe', code: 'FRA' },
    JP: { name: 'Japan', region: 'Asia Pacific', code: 'JPN' },
    SG: { name: 'Singapore', region: 'Asia Pacific', code: 'SGP' },
    AU: { name: 'Australia', region: 'Asia Pacific', code: 'AUS' }
  };
  const services = {
    economy: { name: 'Economy', multiplier: 1, days: [[3, 5], [5, 8], [10, 16]] },
    standard: { name: 'Standard', multiplier: 1.35, days: [[2, 3], [3, 5], [6, 9]] },
    express: { name: 'Express', multiplier: 1.9, days: [[1, 2], [2, 3], [2, 4]] }
  };
  const lanes = [
    { name: 'Domestic', base: 9, perKg: 2.2 },
    { name: 'Regional', base: 16, perKg: 3.2 },
    { name: 'Intercontinental', base: 24, perKg: 4.8 }
  ];
  const cents = n => Math.round((n + Number.EPSILON) * 100);
  function calculate(input) {
    const errors = {};
    if (!Object.hasOwn(countries, input.origin)) errors.origin = 'Select an origin country.';
    if (!Object.hasOwn(countries, input.destination)) errors.destination = 'Select a destination country.';
    if (!Object.hasOwn(services, input.service)) errors.service = 'Select a delivery service.';
    for (const [key, min, max, unit] of [['weight', 0.1, 1000, 'kg'], ['length', 1, 300, 'cm'], ['width', 1, 300, 'cm'], ['height', 1, 300, 'cm']]) {
      if (input[key] === '' || !Number.isFinite(Number(input[key])) || Number(input[key]) < min || Number(input[key]) > max) errors[key] = `Enter ${min}–${max} ${unit}.`;
    }
    if (input.insured && (input.value === '' || !Number.isFinite(Number(input.value)) || Number(input.value) < 100 || Number(input.value) > 50000)) errors.value = 'Enter a value from $100 to $50,000.';
    if (Object.keys(errors).length) return { valid: false, errors };
    const laneIndex = input.origin === input.destination ? 0 : countries[input.origin].region === countries[input.destination].region ? 1 : 2;
    const lane = lanes[laneIndex];
    const service = services[input.service];
    const volumetric = Number(input.length) * Number(input.width) * Number(input.height) / 5000;
    // Round up in 0.5 kg increments. Epsilon prevents floating-point overbilling at a boundary.
    const billable = Math.ceil(Math.max(Number(input.weight), volumetric) * 2 - 1e-9) / 2;
    const base = cents(lane.base * service.multiplier);
    const rate = cents(lane.perKg * service.multiplier);
    const weightCost = Math.round(rate * billable);
    const fuel = Math.round((base + weightCost) * 0.12);
    const insurance = input.insured ? Math.max(500, cents(Number(input.value) * 0.01)) : 0;
    return { valid: true, errors: {}, lane: lane.name, service: service.name, volumetric, billable, base, rate, weightCost, fuel, insurance, total: base + weightCost + fuel + insurance, days: service.days[laneIndex] };
  }
  const api = { calculate, countries, services, lanes };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ShippingCalculator = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
