---
---

{% assign cu = site.data['connect-us'] %}

const WORKER_URL = "https://weddings.tlaq.workers.dev";

eventDate.min = new Date().toISOString().slice(0, 10);
eventDate.max = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().slice(0, 10);

function setMsg(el, text, isError) {
  el.textContent = text;
  el[isError ? 'setAttribute' : 'removeAttribute']('data-error', '');
  el.removeAttribute('aria-hidden');
}

async function sendEmail(e) {
  e.preventDefault();

  connectMsg.textContent = '';
  connectMsg.removeAttribute('data-error');
  connectMsg.setAttribute('aria-hidden', 'true');
  submitBtn.disabled = true;

  const payload = Object.fromEntries(new FormData(connectUsForm));

  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => null);

  resetBtn.style.display = '';
  submitBtn.style.display = 'none';
  if (res?.ok) {
    connectUsForm.hidden = true;
    setMsg(connectMsg, {{ cu.success | jsonify }}, false);
  } else {
    submitBtn.disabled = false;
    setMsg(connectMsg, {{ cu.error | jsonify }}, true);
  }
}

function onReset() {
  connectUsForm.reset();
  connectUsForm.hidden = false;
  submitBtn.disabled = false;
  submitBtn.style.display = '';
  connectMsg.textContent = '';
  connectMsg.removeAttribute('data-error');
  connectMsg.setAttribute('aria-hidden', 'true');
  resetBtn.style.display = 'none';
}
