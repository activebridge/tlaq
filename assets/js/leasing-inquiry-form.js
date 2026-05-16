---
---

{% assign li = site.data.leasing-inquiry %}

const LEASE_WORKER_URL = "https://weddings.tlaq.workers.dev";

leaseMoveInDate.min = new Date().toISOString().slice(0, 10);
leaseMoveInDate.max = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().slice(0, 10);

function setLeaseMsg(el, text, isError) {
  el.textContent = text;
  el[isError ? 'setAttribute' : 'removeAttribute']('data-error', '');
  el.removeAttribute('aria-hidden');
}

async function sendLeasingInquiry(e) {
  e.preventDefault();

  leaseConnectMsg.textContent = '';
  leaseConnectMsg.removeAttribute('data-error');
  leaseConnectMsg.setAttribute('aria-hidden', 'true');
  leaseSubmitBtn.disabled = true;

  const payload = Object.fromEntries(new FormData(leasingInquiryForm));
  payload.type = 'leasing';

  const res = await fetch(LEASE_WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => null);

  leaseResetBtn.style.display = '';
  leaseSubmitBtn.style.display = 'none';
  if (res?.ok) {
    leasingInquiryForm.hidden = true;
    setLeaseMsg(leaseConnectMsg, {{ li.success | jsonify }}, false);
  } else {
    leaseSubmitBtn.disabled = false;
    setLeaseMsg(leaseConnectMsg, {{ li.error | jsonify }}, true);
  }
}

function onLeaseReset() {
  leasingInquiryForm.reset();
  leasingInquiryForm.hidden = false;
  leaseSubmitBtn.disabled = false;
  leaseSubmitBtn.style.display = '';
  leaseConnectMsg.textContent = '';
  leaseConnectMsg.removeAttribute('data-error');
  leaseConnectMsg.setAttribute('aria-hidden', 'true');
  leaseResetBtn.style.display = 'none';
}

document.getElementById('leasingInquiryTrigger')?.addEventListener('click', () => {
  leasingInquiryDialog.showModal();
});

leasingInquiryDialog.addEventListener('click', (e) => {
  if (e.target === leasingInquiryDialog) leasingInquiryDialog.close();
});
