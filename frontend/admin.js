const list = document.getElementById('pending-list');

async function loadPending() {
  list.innerHTML = '';
  const res = await fetch('/api/journal/pending');
  const items = await res.json();
  items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <blockquote>${item.text}</blockquote>
      <small>${item.tag || ''}</small>
      <button data-id="${item._id}" class="approve">Approve</button>
      <button data-id="${item._id}" class="reject">Reject</button>
    `;
    list.append(li);
  });
}

list.addEventListener('click', async e => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('approve')) {
    await fetch(`/api/journal/${id}/approve`, { method: 'PATCH' });
  }
  if (e.target.classList.contains('reject')) {
    await fetch(`/api/journal/${id}`, { method: 'DELETE' });
  }
  loadPending();
});

loadPending(); 