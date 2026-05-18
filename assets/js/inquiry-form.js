const INQUIRY_WORKER_URL = "https://inquiries.tlaq.workers.dev";

function setInquiryMsg(el, text, isError) {
  el.textContent = text;
  el[isError ? 'setAttribute' : 'removeAttribute']('data-error', '');
  el.removeAttribute('aria-hidden');
}

function clearInquiryMsg(el) {
  el.textContent = '';
  el.removeAttribute('data-error');
  el.setAttribute('aria-hidden', 'true');
}

function initInquiryDialog(dialog) {
  const { type, success: successMsg, error: errorMsg, dateInput: dateInputId, trigger: triggerId } = dialog.dataset;
  const form = dialog.querySelector('form');
  const submitBtn = form.querySelector('button[type="submit"]');
  const resetBtn = dialog.querySelector('button[data-reset]');
  const msg = dialog.querySelector('.form-message');
  if (!form || !submitBtn || !resetBtn || !msg) return;

  if (dateInputId) {
    const dateInput = document.getElementById(dateInputId);
    if (dateInput) {
      dateInput.min = new Date().toISOString().slice(0, 10);
      dateInput.max = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().slice(0, 10);
    }
  }

  if (triggerId) {
    document.getElementById(triggerId)?.addEventListener('click', () => dialog.showModal());
  }

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearInquiryMsg(msg);
    submitBtn.disabled = true;

    const payload = Object.fromEntries(new FormData(form));
    payload.type = type;

    const res = await fetch(INQUIRY_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => null);

    resetBtn.style.display = '';
    submitBtn.style.display = 'none';
    if (res?.ok) {
      form.hidden = true;
      setInquiryMsg(msg, successMsg, false);
    } else {
      submitBtn.disabled = false;
      setInquiryMsg(msg, errorMsg, true);
    }
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    form.hidden = false;
    submitBtn.disabled = false;
    submitBtn.style.display = '';
    clearInquiryMsg(msg);
    resetBtn.style.display = 'none';
  });
}

document.querySelectorAll('dialog.inquiry-form').forEach(initInquiryDialog);
