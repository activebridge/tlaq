---
---

{% assign fp = site.data.filming-permit-inquiry %}

const FILM_WORKER_URL = "https://weddings.tlaq.workers.dev";

function setFilmMsg(el, text, isError) {
  el.textContent = text;
  el[isError ? 'setAttribute' : 'removeAttribute']('data-error', '');
  el.removeAttribute('aria-hidden');
}

async function sendFilmingPermitInquiry(e) {
  e.preventDefault();

  filmConnectMsg.textContent = '';
  filmConnectMsg.removeAttribute('data-error');
  filmConnectMsg.setAttribute('aria-hidden', 'true');
  filmSubmitBtn.disabled = true;

  const payload = Object.fromEntries(new FormData(filmingPermitForm));
  payload.type = 'filming-permit';

  const res = await fetch(FILM_WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => null);

  filmResetBtn.style.display = '';
  filmSubmitBtn.style.display = 'none';
  if (res?.ok) {
    filmingPermitForm.hidden = true;
    setFilmMsg(filmConnectMsg, {{ fp.success | jsonify }}, false);
  } else {
    filmSubmitBtn.disabled = false;
    setFilmMsg(filmConnectMsg, {{ fp.error | jsonify }}, true);
  }
}

function onFilmReset() {
  filmingPermitForm.reset();
  filmingPermitForm.hidden = false;
  filmSubmitBtn.disabled = false;
  filmSubmitBtn.style.display = '';
  filmConnectMsg.textContent = '';
  filmConnectMsg.removeAttribute('data-error');
  filmConnectMsg.setAttribute('aria-hidden', 'true');
  filmResetBtn.style.display = 'none';
}

document.getElementById('filmingPermitTrigger')?.addEventListener('click', () => {
  filmingPermitDialog.showModal();
});

filmingPermitDialog.addEventListener('click', (e) => {
  if (e.target === filmingPermitDialog) filmingPermitDialog.close();
});
