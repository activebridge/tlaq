---
---

{% assign cfs = site.data['call-for-submission'] %}

const ALLOWED_TYPES = {{ cfs.allowed_types | split: ',' | jsonify }};
const WORKER_URL = {{ site.data.site.submission_worker_url | jsonify }};
const MAX_SIZE = {{ cfs.max_file_size_mb }} * 1024 * 1024;

photoDate.max = new Date().toISOString().slice(0, 10);

function setFileError(msg) {
  fileName.textContent = msg;
  fileName.setAttribute('data-error', '');
  photo.value = '';
}

function setMsg(el, text, isError) {
  el.textContent = text;
  el[isError ? 'setAttribute' : 'removeAttribute']('data-error', '');
  el.removeAttribute('aria-hidden');
}

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) return setFileError(uploadTypeError.textContent);
  if (file.size > MAX_SIZE) return setFileError(uploadSizeError.textContent);
  fileName.textContent = file.name;
  fileName.removeAttribute('data-error');
}

function onDragEnter(e) { e.preventDefault(); fileUploadArea.classList.add('drag-over'); }
function onDragLeave(e) { if (!fileUploadArea.contains(e.relatedTarget)) fileUploadArea.classList.remove('drag-over'); }
function onDragOver(e) { e.preventDefault(); }

function onDrop(e) {
  e.preventDefault();
  fileUploadArea.classList.remove('drag-over');
  if (e.dataTransfer.files.length) {
    photo.files = e.dataTransfer.files;
    photo.dispatchEvent(new Event('change'));
  }
}

async function sendEmail(e) {
  e.preventDefault();
  if (!photo.files.length) return setFileError({{ cfs.photo_required | jsonify }});

  submissionMsg.textContent = '';
  submissionMsg.removeAttribute('data-error');
  submissionMsg.setAttribute('aria-hidden', 'true');
  submitBtn.disabled = true;

  const res = await fetch(WORKER_URL, { method: 'POST', body: new FormData(submissionForm) }).catch(() => null);

  resetBtn.style.display = '';
  submitBtn.style.display = 'none';
  if (res?.ok) {
    submissionForm.hidden = true;
    setMsg(submissionMsg, {{ cfs.success | jsonify }}, false);
  } else {
    submitBtn.disabled = false;
    setMsg(submissionMsg, {{ cfs.error | jsonify }}, true);
  }
}

function onReset() {
  submissionForm.reset();
  submissionForm.hidden = false;
  fileName.textContent = '';
  fileName.removeAttribute('data-error');
  fileUploadArea.classList.remove('drag-over');
  submitBtn.disabled = false;
  submitBtn.style.display = '';
  submissionMsg.textContent = '';
  submissionMsg.removeAttribute('data-error');
  submissionMsg.setAttribute('aria-hidden', 'true');
  resetBtn.style.display = 'none';
}
