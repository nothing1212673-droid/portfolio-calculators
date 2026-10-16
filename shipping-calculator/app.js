'use strict';
const $ = id => document.getElementById(id);
const form = $('shipping-form');
const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
const kg = n => n > 0 && n < 0.01 ? '<0.01 kg' : `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n)} kg`;
let announcementTimer;
for (const id of ['origin', 'destination']) {
  for (const [key, country] of Object.entries(ShippingCalculator.countries)) $(id).add(new Option(country.name, key));
}
$('origin').value = 'US'; $('destination').value = 'GB';
function update() {
  $('value').disabled = !$('insured').checked;
  const input = Object.fromEntries(new FormData(form));
  input.insured = $('insured').checked;
  $('value-field').hidden = !input.insured;
  const result = ShippingCalculator.calculate(input);
  for (const key of ['origin', 'destination', 'weight', 'length', 'width', 'height', 'value', 'service']) {
    $(`${key}-error`).textContent = result.errors[key] || '';
    if ($(key)) $(key).setAttribute('aria-invalid', String(Boolean(result.errors[key])));
  }
  $('result-content').hidden = !result.valid;
  $('invalid-result').hidden = result.valid;
  clearTimeout(announcementTimer);
  if (!result.valid) {
    $('total').textContent = '—'; $('service-name').textContent = 'Check your details';
    announcementTimer = setTimeout(() => { $('announcement').textContent = 'Estimate unavailable. Please correct the highlighted fields.'; }, 500);
    return;
  }
  $('total').textContent = money(result.total);
  $('service-name').textContent = `${result.service} delivery`;
  $('eta').textContent = `${result.days[0]}–${result.days[1]} business days`;
  for (const [id, value] of Object.entries({ base: result.base, 'weight-cost': result.weightCost, fuel: result.fuel, insurance: result.insurance })) $(id).textContent = money(value);
  $('weight-label').textContent = `${kg(result.billable)} × ${money(result.rate)}/kg`;
  $('actual').textContent = kg(Number(input.weight));
  $('volumetric').textContent = kg(result.volumetric);
  $('billable').textContent = kg(result.billable);
  for (const [prefix, key] of [['from', 'origin'], ['to', 'destination']]) {
    $(`${prefix}-code`).textContent = ShippingCalculator.countries[input[key]].code;
    $(`${prefix}-name`).textContent = ShippingCalculator.countries[input[key]].name;
  }
  announcementTimer = setTimeout(() => { $('announcement').textContent = `Estimated total ${money(result.total)}. ${result.days.join(' to ')} business days.`; }, 500);
}
form.addEventListener('input', update);
form.addEventListener('change', update);
form.addEventListener('submit', e => e.preventDefault());
form.addEventListener('reset', () => { setTimeout(() => { $('origin').value = 'US'; $('destination').value = 'GB'; update(); }, 0); });
function setPresentation(on) {
  document.body.classList.toggle('presentation', on);
  $('presentation').setAttribute('aria-pressed', String(on));
  const url = new URL(location.href);
  if (on) url.searchParams.set('presentation', '1'); else url.searchParams.delete('presentation');
  try { history.replaceState(null, '', url); } catch (_) { /* The layout still works when file URL history is restricted. */ }
}
$('presentation').addEventListener('click', () => setPresentation(!document.body.classList.contains('presentation')));
setPresentation(new URLSearchParams(location.search).get('presentation') === '1');
update();
