document.querySelector('.comment-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const name = document.querySelector('input[placeholder="Name"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;
    const message = document.querySelector('textarea[placeholder="Message..."]').value;
    const saveInfo = document.querySelector('input[type="checkbox"]').checked;
  
    try {
      const response = await fetch('http://localhost:3000/contact/submit-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message, saveInfo })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
        document.querySelector('.comment-form').reset();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Something went wrong. Please try again later.');
    }
  });
  