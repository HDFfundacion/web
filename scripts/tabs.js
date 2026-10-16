/**
 * Tab Navigation Component
 * Fundación Huellas del Futuro
 */

export function initTabs() {
  const tabGroups = document.querySelectorAll('[data-tabs-group]');

  tabGroups.forEach(group => {
    const tabButtons = group.querySelectorAll('.tab-btn');
    const tabPanels = group.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab-target');

        tabButtons.forEach(b => b.classList.remove('is-active'));
        tabPanels.forEach(p => p.classList.remove('is-active'));

        btn.classList.add('is-active');
        const targetPanel = group.querySelector(`#${targetId}`);
        if (targetPanel) {
          targetPanel.classList.add('is-active');
        }
      });
    });
  });
}
