document.addEventListener('DOMContentLoaded', () => {
  const pendingList = document.getElementById('pending-list');
  const approvedList = document.getElementById('approved-list');
  const pendingEmpty = document.getElementById('pending-empty');
  const approvedEmpty = document.getElementById('approved-empty');

  async function loadEntries() {
    pendingList.innerHTML = '';
    approvedList.innerHTML = '';
    
    // Show empty states initially
    pendingEmpty.style.display = 'block';
    approvedEmpty.style.display = 'block';

    try {
      const res = await fetch('/api/journal/all');
      const entries = await res.json();

      let pendingCount = 0;
      let approvedCount = 0;

      entries.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'entry-card';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'entry-text';
        textDiv.textContent = entry.text;
        card.appendChild(textDiv);

        if (entry.tag) {
          const tagSpan = document.createElement('span');
          tagSpan.className = 'entry-tag';
          tagSpan.textContent = entry.tag;
          card.appendChild(tagSpan);
        }

        if (entry.approved) {
          approvedCount++;
          // Hide empty state when we have approved entries
          approvedEmpty.style.display = 'none';
          
          // Approved card layout
          const actionsDiv = document.createElement('div');
          actionsDiv.className = 'entry-actions';
          
          const delBtn = document.createElement('button');
          delBtn.className = 'btn-delete';
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
          
          actionsDiv.appendChild(delBtn);
          card.appendChild(actionsDiv);
          approvedList.appendChild(card);
        } else {
          pendingCount++;
          // Hide empty state when we have pending entries
          pendingEmpty.style.display = 'none';
          
          // Pending card layout
          const actionsDiv = document.createElement('div');
          actionsDiv.className = 'entry-actions';

          const approveBtn = document.createElement('button');
          approveBtn.className = 'btn-approve';
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
          rejectBtn.className = 'btn-reject';
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

          actionsDiv.appendChild(approveBtn);
          actionsDiv.appendChild(rejectBtn);
          card.appendChild(actionsDiv);
          pendingList.appendChild(card);
        }
      });

      // Update statistics
      document.getElementById('pending-count').textContent = pendingCount;
      document.getElementById('approved-count').textContent = approvedCount;
      document.getElementById('total-count').textContent = entries.length;

    } catch (err) {
      console.error('Failed to load entries:', err);
      pendingList.innerHTML = '<div style="color: #ef4444; text-align: center; padding: 20px;">Failed to load entries. Please try again.</div>';
      approvedList.innerHTML = '<div style="color: #ef4444; text-align: center; padding: 20px;">Failed to load entries. Please try again.</div>';
    }
  }

  // Show admin console if logged in
  if (localStorage.getItem('adminLoggedIn') === 'true') {
    document.getElementById('admin-console').classList.remove('hidden');
  }

  loadEntries();
});
