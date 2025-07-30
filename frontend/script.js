const map = L.map('map').setView([56.1304, -106.3468], 4); // Centered on Canada
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const stories = [
  { id: 1, lat: 53.5461, lng: -113.4938, title: 'Edmonton Story', short: 'A journey of healing.', full: 'Full story for Edmonton. (Dummy text)' },
  { id: 2, lat: 45.4215, lng: -75.6997, title: 'Ottawa Story', short: 'Finding community.', full: 'Full story for Ottawa. (Dummy text)' },
  { id: 3, lat: 49.2827, lng: -123.1207, title: 'Vancouver Story', short: 'Overcoming stigma.', full: 'Full story for Vancouver. (Dummy text)' },
  { id: 4, lat: 51.0447, lng: -114.0719, title: 'Calgary Story', short: 'Strength in tradition.', full: 'Full story for Calgary. (Dummy text)' },
  { id: 5, lat: 46.8139, lng: -71.2082, title: 'Quebec City Story', short: 'A voice for youth.', full: 'Full story for Quebec City. (Dummy text)' },

];

stories.forEach(story => {
  const marker = L.marker([story.lat, story.lng]).addTo(map);
  marker.bindPopup(`<b>${story.title}</b><br>${story.short}<br><button class='open-modal-btn' data-id='${story.id}'>Read More</button>`);
});

const modal = document.getElementById('story-modal');
const closeBtn = document.querySelector('.close-btn');
map.on('popupopen', function(e) {
  const btn = e.popup._contentNode.querySelector('.open-modal-btn');
  if (btn) {
    btn.onclick = function() {
      const story = stories.find(s => s.id == btn.dataset.id);
      document.getElementById('modal-title').textContent = story.title;
      document.getElementById('modal-description').textContent = story.short;
      document.getElementById('modal-full-story').textContent = story.full;
      modal.classList.remove('hidden');
    };
  }
});
closeBtn.onclick = () => modal.classList.add('hidden');
window.onclick = e => { if (e.target === modal) modal.classList.add('hidden'); };


function navigateCarousel(direction) {
  const slides = ['slide1', 'slide2', 'slide3', 'slide4'];
  const currentSlide = document.querySelector('input[name="carousel"]:checked');
  let currentIndex = slides.indexOf(currentSlide.id);
  
  if (direction === 1) {
    // Next
    currentIndex = (currentIndex + 1) % slides.length;
  } else {
    // Previous
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  }
  
  document.getElementById(slides[currentIndex]).checked = true;
}

const journalForm = document.getElementById('journal-form');
const journalEntriesDiv = document.getElementById('journal-entries');

async function fetchEntries() {
  try {
    const res = await fetch('http://localhost:5000/api/journal');
    const entries = await res.json();
    journalEntriesDiv.innerHTML = '';
    entries.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'journal-card';
      card.innerHTML = `<div>“${entry.text}”</div>${entry.tag ? `<div class='tag'>${entry.tag}</div>` : ''}`;
      journalEntriesDiv.appendChild(card);
    });
  } catch (err) {
    journalEntriesDiv.innerHTML = '<div style="color:var(--primary-dark);">Could not load journal entries.</div>';
    console.error('Failed to fetch journal entries:', err);
  }
}

journalForm.onsubmit = async e => {
  e.preventDefault();
  const text = document.getElementById('journal-text').value.trim();
  const tag = document.getElementById('journal-tag').value;
  const confirmation = document.getElementById('journal-confirmation');

  if (!text) return;

  try {
    await fetch('http://localhost:5000/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, tag })
    });

    confirmation.classList.remove('hidden');

    journalForm.reset();

    setTimeout(() => {
      confirmation.classList.add('hidden');
    }, 4000);

    fetchEntries();

  } catch (err) {
    alert('Failed to submit. Try again.');
    console.error('Failed to submit journal entry:', err);
  }
};

fetchEntries(); 