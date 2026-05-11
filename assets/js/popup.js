(() => {
  const STORAGE_KEY_PREFIX = 'tlaq_popup_dismissed_';
  const DEFAULT_DELAY = 3;

  const onReady = (callback) => {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  };

  const storageKey = (dialog) => STORAGE_KEY_PREFIX + (dialog.dataset.version || '0');

  const isDismissed = (dialog) => {
    try { return sessionStorage.getItem(storageKey(dialog)) } catch { return false }
  };

  const markDismissed = (dialog) => {
    try { sessionStorage.setItem(storageKey(dialog), '1') } catch {}
  };

  const getDelay = (dialog) => {
    const delay = parseFloat(dialog.dataset.delay);

    return Number.isNaN(delay) || delay < 0 ? DEFAULT_DELAY : delay;
  };

  const initPopup = () => {
    const dialog = document.getElementById('sitePopup');

    if (!dialog?.showModal || isDismissed(dialog)) { return }

    setTimeout(() => {
      if (!dialog.open) { dialog.showModal() }
    }, getDelay(dialog) * 1000);

    dialog.addEventListener('click', ({ target }) => {
      if (target === dialog) { dialog.close() }
    });

    dialog.addEventListener('close', () => markDismissed(dialog));
  };

  onReady(initPopup);
})();
