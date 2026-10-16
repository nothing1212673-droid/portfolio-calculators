'use strict';
const $ = id => document.getElementById(id);
const form = $('construction-form');
const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
const number = (n, decimals = 2) => new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(n);
let areaSqFt = 1200;
let announcementTimer;
function update() {
  const data = new FormData(form);
  const unit = data.get('unit');
  const input = { areaSqFt, scope: data.get('scope'), material: data.get('material'), property: data.get('property'), extras: data.getAll('extras') };
  const result = ConstructionCalculator.calculate(input);
  const isSqFt = unit === 'sqft';
  $('area-unit').textContent = isSqFt ? 'sq ft' : 'm²';
  $('area').min = isSqFt ? '1' : String(ConstructionCalculator.SQM_PER_SQFT);
  $('area').max = isSqFt ? '100000' : '9290.304';
  $('area-error').textContent = result.errors.area ? (isSqFt ? 'Enter 1–100,000 sq ft.' : 'Enter 0.09290304–9,290.304 m².') : '';
  $('area').setAttribute('aria-invalid', String(Boolean(result.errors.area)));
  $('result-content').hidden = !result.valid;
  $('invalid-result').hidden = result.valid;
  $('print').disabled = !result.valid;
  clearTimeout(announcementTimer);
  if (!result.valid) {
    $('total').textContent = '—'; $('cost-per-area').textContent = 'Check your project details';
    announcementTimer = setTimeout(() => { $('announcement').textContent = 'Estimate unavailable. Enter a valid project area.'; }, 500);
    return;
  }
  const displayArea = isSqFt ? areaSqFt : areaSqFt * ConstructionCalculator.SQM_PER_SQFT;
  $('total').textContent = money(result.total);
  $('total-repeat').textContent = money(result.total);
  $('cost-per-area').textContent = `${money(Math.round(result.total / displayArea))} / ${isSqFt ? 'sq ft' : 'm²'}`;
  $('summary-property').textContent = ConstructionCalculator.properties[input.property].name;
  $('summary-area').textContent = `${number(displayArea)} ${isSqFt ? 'sq ft' : 'm²'}`;
  $('chart-area').textContent = number(displayArea, 1);
  $('chart-unit').textContent = isSqFt ? 'SQUARE FEET' : 'SQUARE METERS';
  for (const [id, value] of Object.entries({ 'materials-cost': result.material, 'labor-cost': result.labor, 'tax-cost': result.tax, 'reserve-cost': result.contingency })) $(id).textContent = money(value);
  const p1 = result.material / result.total * 100;
  const p2 = p1 + result.labor / result.total * 100;
  const p3 = p2 + result.tax / result.total * 100;
  $('donut').style.background = `conic-gradient(var(--material) 0% ${p1}%, var(--labor) ${p1}% ${p2}%, var(--tax) ${p2}% ${p3}%, var(--reserve) ${p3}% 100%)`;
  $('donut').setAttribute('aria-label', `Cost breakdown: materials ${number(p1, 1)}%, labor ${number(p2 - p1, 1)}%, tax ${number(p3 - p2, 1)}%, contingency ${number(100 - p3, 1)}%. Exact amounts listed below.`);
  $('print-spec').textContent = `${number(displayArea, 6)} ${isSqFt ? 'sq ft' : 'm²'} · ${ConstructionCalculator.properties[input.property].name} · ${ConstructionCalculator.scopes[input.scope].name} · ${ConstructionCalculator.materials[input.material].name} materials. Selected add-ons: ${input.extras.length ? input.extras.map(key => ConstructionCalculator.extras[key].name).join(', ') : 'None'}.`;
  $('print-items').replaceChildren(...result.items.map(item => {
    const row = document.createElement('tr');
    for (const value of [item.name, money(item.material), money(item.labor), money(item.material + item.labor)]) { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); }
    return row;
  }));
  announcementTimer = setTimeout(() => { $('announcement').textContent = `Estimated project total ${money(result.total)}.`; }, 500);
}
form.addEventListener('input', event => {
  if (event.target.id === 'area') {
    const value = $('area').value;
    const isSqFt = new FormData(form).get('unit') === 'sqft';
    areaSqFt = value === '' ? '' : Number(value) / (isSqFt ? 1 : ConstructionCalculator.SQM_PER_SQFT);
  }
  if (event.target.name === 'unit') {
    const isSqFt = event.target.value === 'sqft';
    if (areaSqFt !== '' && Number.isFinite(areaSqFt)) $('area').value = String(Number((areaSqFt * (isSqFt ? 1 : ConstructionCalculator.SQM_PER_SQFT)).toFixed(8)));
  }
  update();
});
form.addEventListener('change', update);
form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('reset', () => { setTimeout(() => { areaSqFt = 1200; update(); }, 0); });
$('print').addEventListener('click', () => { update(); if (!$('print').disabled) window.print(); });
function setPresentation(on) {
  document.body.classList.toggle('presentation', on);
  $('presentation').setAttribute('aria-pressed', String(on));
  const url = new URL(location.href);
  if (on) url.searchParams.set('presentation', '1'); else url.searchParams.delete('presentation');
  try { history.replaceState(null, '', url); } catch (_) { /* File URL history can be restricted. */ }
}
$('presentation').addEventListener('click', () => setPresentation(!document.body.classList.contains('presentation')));
setPresentation(new URLSearchParams(location.search).get('presentation') === '1');
update();
