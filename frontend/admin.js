document.addEventListener('DOMContentLoaded', () => {
  const pendingList = document.getElementById('pending-list');
  const approvedList = document.getElementById('approved-list');

  async function loadEntries() {
    pendingList.innerHTML = '';
    approvedList.innerHTML = '';

    try {
      const res = await fetch('/api/journal/all');
      const entries = await res.json();

      entries.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'pending-card';
        card.innerHTML = `
          <br><div>
            <b>${entry.text}</b>
            ${entry.tag ? `<span class='tag'>${entry.tag}</span>` : ''}
          </div>
        `;

        if (entry.approved) {
          // Approved card layout
          const delBtn = document.createElement('button');
          delBtn.textContent = 'Delete';
          delBtn.onclick = async () => {
            try {
              console.log('Deleting entry:', entry._id);
              const response = await fetch(`/api/journal/${entry._id}`, { method: 'DELETE' });
              
              if (!response.ok) {
                const errorData = await response.json();
                console.error('Deletion failed:', response.status, errorData);
                alert('Failed to delete entry: ' + (errorData.error || 'Unknown error'));
                return;
              }
              
              const result = await response.json();
              console.log('Deletion successful:', result);
              loadEntries();
            } catch (error) {
              console.error('Error deleting entry:', error);
              alert('Error deleting entry: ' + error.message);
            }
          };
          card.appendChild(delBtn);
          approvedList.appendChild(card);
        } else {
          // Pending card layout
          const buttonContainer = document.createElement('div');
          buttonContainer.style.marginTop = '0.7rem';

          const approveBtn = document.createElement('button');
          approveBtn.className = 'approve';
          approveBtn.textContent = 'Approve';
          approveBtn.onclick = async () => {
            try {
              console.log('Approving entry:', entry._id);
              const response = await fetch(`/api/journal/${entry._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' })
              });
              
              if (!response.ok) {
                const errorData = await response.json();
                console.error('Approval failed:', response.status, errorData);
                alert('Failed to approve entry: ' + (errorData.error || 'Unknown error'));
                return;
              }
              
              const result = await response.json();
              console.log('Approval successful:', result);
              loadEntries();
            } catch (error) {
              console.error('Error approving entry:', error);
              alert('Error approving entry: ' + error.message);
            }
          };

          const rejectBtn = document.createElement('button');
          rejectBtn.className = 'reject';
          rejectBtn.textContent = 'Reject';
          rejectBtn.onclick = async () => {
            try {
              console.log('Rejecting entry:', entry._id);
              const response = await fetch(`/api/journal/${entry._id}`, { method: 'DELETE' });
              
              if (!response.ok) {
                const errorData = await response.json();
                console.error('Rejection failed:', response.status, errorData);
                alert('Failed to reject entry: ' + (errorData.error || 'Unknown error'));
                return;
              }
              
              const result = await response.json();
              console.log('Rejection successful:', result);
              loadEntries();
            } catch (error) {
              console.error('Error rejecting entry:', error);
              alert('Error rejecting entry: ' + error.message);
            }
          };

          buttonContainer.appendChild(approveBtn);
          buttonContainer.appendChild(rejectBtn);
          card.appendChild(buttonContainer);
          pendingList.appendChild(card);
        }
      });
    } catch (err) {
      console.error('Failed to load entries:', err);
      pendingList.innerHTML = '<div style="color:#e53935;">Failed to load pending entries.</div>';
    }
  }

  // Show admin console if logged in
  if (localStorage.getItem('adminLoggedIn') === 'true') {
    document.getElementById('admin-console').classList.remove('hidden');
  }

  loadEntries();
});
