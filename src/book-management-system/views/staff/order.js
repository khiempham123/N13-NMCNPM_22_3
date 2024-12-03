// // Mở popup edit sách
// document.getElementById("editOrder").addEventListener("click", function () {
//   document.getElementById("editOrderPopup").style.display = "flex";
// });

// // Đóng popup edit sách
// document
//   .getElementById("closeEditOrderPopup")
//   .addEventListener("click", function () {
//     document.getElementById("editOrderPopup").style.display = "none";
//   });

// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  // Select all edit buttons within the table
  const editButtons = document.querySelectorAll(".editOrder");

  // Select the popup and its elements
  const popup = document.getElementById("editOrderPopup");
  const closeBtn = document.getElementById("closeEditOrderPopup");
  const saveBtn = document.getElementById("saveOrderBtn");
  const nameInput = document.getElementById("editOrderName");
  const addressInput = document.getElementById("editOrderAddress");
  const statusSelect = document.getElementById("order-status");

  // Variable to keep track of the current row being edited
  let currentRow = null;

  // Function to open the popup and populate it with current row data
  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Find the closest table row (tr) from the clicked button
      currentRow = e.target.closest("tr");

      if (currentRow) {
        // Retrieve all cells (td) in the current row
        const cells = currentRow.querySelectorAll("td");

        // Extract data from the cells
        const name = cells[1].textContent.trim();
        const address = cells[2].textContent.trim();
        const status = cells[4].textContent.trim().toLowerCase();

        // Populate the popup input fields with the current data
        nameInput.value = name;
        addressInput.value = address;

        // Set the select dropdown to match the current status
        // This ensures that the correct option is selected regardless of case
        for (let option of statusSelect.options) {
          if (option.value.toLowerCase() === status) {
            statusSelect.value = option.value;
            break;
          }
        }

        // Display the popup by setting its display style to 'flex'
        popup.style.display = "flex";
      }
    });
  });

  // Function to close the popup without saving changes
  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  // Function to save the updated data back to the table
  saveBtn.addEventListener("click", () => {
    if (currentRow) {
      // Retrieve all cells (td) in the current row
      const cells = currentRow.querySelectorAll("td");

      // Update the table cells with the new values from the popup
      cells[1].textContent = nameInput.value.trim();
      cells[2].textContent = addressInput.value.trim();
      cells[4].textContent = statusSelect.value;

      // Optionally, update the "Total" or other fields if needed
      // cells[3].textContent = updatedTotalValue;

      // Hide the popup after saving
      popup.style.display = "none";
    }
  });

  // Optional: Close the popup when clicking outside of it
  window.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
});
