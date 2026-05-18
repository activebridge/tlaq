---
---

{% assign ci = site.data.corporate-inquiry %}

const CORP_WORKER_URL = "https://inquiries.tlaq.workers.dev";

corpEventDate.min = new Date().toISOString().slice(0, 10);
corpEventDate.max = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().slice(0, 10);

function setCorpMsg(el, text, isError) {
  el.textContent = text;
  el[isError ? 'setAttribute' : 'removeAttribute']('data-error', '');
  el.removeAttribute('aria-hidden');
}

async function sendCorporateInquiry(e) {
  e.preventDefault();

  corpConnectMsg.textContent = '';
  corpConnectMsg.removeAttribute('data-error');
  corpConnectMsg.setAttribute('aria-hidden', 'true');
  corpSubmitBtn.disabled = true;

  const payload = Object.fromEntries(new FormData(corporateInquiryForm));
  payload.type = 'corporate';

  const res = await fetch(CORP_WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => null);

  corpResetBtn.style.display = '';
  corpSubmitBtn.style.display = 'none';
  if (res?.ok) {
    corporateInquiryForm.hidden = true;
    setCorpMsg(corpConnectMsg, {{ ci.success | jsonify }}, false);
  } else {
    corpSubmitBtn.disabled = false;
    setCorpMsg(corpConnectMsg, {{ ci.error | jsonify }}, true);
  }
}

function onCorpReset() {
  corporateInquiryForm.reset();
  corporateInquiryForm.hidden = false;
  corpSubmitBtn.disabled = false;
  corpSubmitBtn.style.display = '';
  corpConnectMsg.textContent = '';
  corpConnectMsg.removeAttribute('data-error');
  corpConnectMsg.setAttribute('aria-hidden', 'true');
  corpResetBtn.style.display = 'none';
}

document.getElementById('corporateInquiryTrigger')?.addEventListener('click', () => {
  corporateInquiryDialog.showModal();
});

corporateInquiryDialog.addEventListener('click', (e) => {
  if (e.target === corporateInquiryDialog) corporateInquiryDialog.close();
});
