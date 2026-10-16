/**
 * Interactive Donation Impact Calculator
 * Fundación Huellas del Futuro
 */

export function initCalculator() {
  const chips = document.querySelectorAll('.amount-chip');
  const outcomeText = document.getElementById('impactOutcomeText');
  const customInput = document.getElementById('customAmountInput');
  const donateModalAmount = document.getElementById('modalDonationAmount');

  const impacts = {
    '30000': 'Aporta materiales pedagógicos y lúdicos para 1 niño en los programas de Miranda, Cauca.',
    '50000': 'Financia 1 taller de formación comunitaria y aprovechamiento del tiempo libre.',
    '100000': 'Cubre 1 jornada de asistencia técnica agronómica en campo para una familia campesina.',
    '250000': 'Impulsa insumos orgánicos y fortalecimiento de vivero para parcelas de Cacao y Cítricos.',
    '500000': 'Apoya el encadenamiento productivo y certificación exportadora para asociaciones del suroccidente.'
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');

      const amount = chip.getAttribute('data-amount');
      if (customInput) customInput.value = '';

      updateImpact(amount);
    });
  });

  if (customInput) {
    customInput.addEventListener('input', () => {
      chips.forEach(c => c.classList.remove('is-selected'));
      const val = parseInt(customInput.value.replace(/\D/g, ''), 10) || 0;
      updateCustomImpact(val);
    });
  }

  function updateImpact(val) {
    if (outcomeText && impacts[val]) {
      outcomeText.innerHTML = `<strong>Impacto tangible:</strong> ${impacts[val]}`;
    }
    if (donateModalAmount) {
      const num = parseInt(val, 10);
      donateModalAmount.textContent = `$${num.toLocaleString('es-CO')} COP`;
    }
  }

  function updateCustomImpact(num) {
    let msg = 'Cada aporte siembra futuro en el campo colombiano y fortalece a nuestras comunidades.';
    if (num >= 500000) {
      msg = impacts['500000'];
    } else if (num >= 250000) {
      msg = impacts['250000'];
    } else if (num >= 100000) {
      msg = impacts['100000'];
    } else if (num >= 50000) {
      msg = impacts['50000'];
    } else if (num >= 30000) {
      msg = impacts['30000'];
    }

    if (outcomeText) {
      outcomeText.innerHTML = `<strong>Impacto tangible:</strong> ${msg}`;
    }
    if (donateModalAmount) {
      donateModalAmount.textContent = num > 0 ? `$${num.toLocaleString('es-CO')} COP` : 'Aporte voluntario';
    }
  }
}
