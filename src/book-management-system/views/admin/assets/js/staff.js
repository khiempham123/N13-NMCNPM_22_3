const API_BASEADMIN_URL = "http://localhost:3000/admin";

let staffList = []; // Mảng dữ liệu staff từ API
let editStaffId = null; // ID của staff đang được sửa

// DOM Elements
const staffTableBody = document.getElementById("staffTableBody");
const modal = document.getElementById("addProductModal");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.querySelector(".close");
const addStaffBtn = document.getElementById("btn-addproduct");
const form = document.getElementById("staffForm");

// Input Fields
const nameInput = document.getElementById("name");
const genderInput = document.getElementById("gender");
const positionInput = document.getElementById("position");
const salaryInput = document.getElementById("salary");
// const avatarInput = document.getElementById("avatar");

// Fetch Staff List
const fetchStaffList = async () => {
  try {
    const response = await fetch(`${API_BASEADMIN_URL}/staff/`);
    if (!response.ok) throw new Error("Failed to fetch staff data");

    staffList = await response.json();
    renderStaffList();
  } catch (error) {
    console.error("Error fetching staff list:", error);
  }
};

// Render Staff List
const renderStaffList = () => {
  staffTableBody.innerHTML = "";
  staffList.forEach((staff) => {
    staffTableBody.innerHTML += `
      <tr>
        <td>
          <img class="img-Staff" src="${
            staff.avatar ||
            "https://png.pngtree.com/png-clipart/20200701/original/pngtree-black-default-avatar-png-image_5407174.jpg"
          }" alt="Staff Image" />
        </td>
        <td>${staff.fullName}</td>
        <td>${staff.gender}</td>
        <td>${staff.position}</td>
        <td>${staff.salary}</td>
        <td>
          <span class="status inProgress" style="cursor: pointer;" onclick="editStaff('${
            staff._id
          }')">Edit</span>
          <span class="status return" style="cursor: pointer;" onclick="deleteStaff('${
            staff._id
          }')">Delete</span>
        </td>
      </tr>
    `;
  });
};


const editStaffModal = document.getElementById("editStaffModal");
const closeEditModal = document.getElementById("closeEditModal");
const editStaffForm = document.getElementById("editStaffForm");

// Open the Edit Modal
async function editStaff(staffId) {
  try {
    // Fetch staff details by ID
    const response = await fetch(`http://localhost:3000/admin/staff/${staffId}`);
    const staff = await response.json();

    // Populate modal with staff details
    document.getElementById("editUsername").value = staff.username;
    document.getElementById("editEmail").value = staff.email;
    document.getElementById("editPhone").value = staff.phone;
    document.getElementById("editFullName").value = staff.fullName;
    document.getElementById("editDateOfBirth").value = staff.dateOfBirth;
    document.getElementById("editGender").value = staff.gender;
    document.getElementById("editPosition").value = staff.position;
    document.getElementById("editSalary").value = staff.salary;
    document.getElementById("editAddress").value = staff.address;

    // Show modal
    editStaffModal.style.display = "block";

    // Save staffId to a hidden input (optional for reference)
    editStaffForm.setAttribute("data-id", staffId);
  } catch (error) {
    console.error("Error fetching staff details:", error);
    alert("Failed to load staff details.");
  }
}

// Close the Edit Modal
closeEditModal.addEventListener("click", () => {
  editStaffModal.style.display = "none";
});

// Submit the Edit Form
editStaffForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form from reloading page

  const staffId = editStaffForm.getAttribute("data-id");

  // Gather updated data
  const updatedStaff = {
    email: document.getElementById("editEmail").value,
    phone: document.getElementById("editPhone").value,
    fullName: document.getElementById("editFullName").value,
    dateOfBirth: document.getElementById("editDateOfBirth").value,
    gender: document.getElementById("editGender").value,
    position: document.getElementById("editPosition").value,
    salary: parseFloat(document.getElementById("editSalary").value),
    address: document.getElementById("editAddress").value,
  };

  try {
    const response = await fetch(`http://localhost:3000/admin/staff/${staffId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStaff),
    });

    if (response.ok) {
      alert("Staff updated successfully!");
      editStaffModal.style.display = "none"; // Close the modal
      location.reload(); // Refresh the page to show updated data
    } else {
      throw new Error("Failed to update staff.");
    }
  } catch (error) {
    console.error("Error updating staff:", error);
    alert("Error updating staff.");
  }
});

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === editStaffModal) {
    editStaffModal.style.display = "none";
  }
});


// Delete Staff
const deleteStaff = async (id) => {
  if (confirm("Are you sure you want to delete this staff?")) {
    try {
      const response = await fetch(`${API_BASEADMIN_URL}/staff/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete staff");

      await fetchStaffList(); // Cập nhật lại danh sách
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  }
};

// Open and Close Modal
const openModal = () => (modal.style.display = "block");
const closeModal = () => {
  modal.style.display = "none";
  form.reset();
  modalTitle.textContent = "Add Staff";
  editStaffId = null;
};

// Event Listeners
addStaffBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// const submitAddStaff = document.querySelector(".form-buttons");
// submitAddStaff.addEventListener("click", (e) => {
//   addEventListener();
// });

// Fetch dữ liệu staff khi tải trang
document.addEventListener("DOMContentLoaded", fetchStaffList);

// DOM elements


const staffForm = document.getElementById("staffForm");





// Submit form
staffForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Gather form data
  const formData = new FormData(staffForm);
  const staffData = {
    username: formData.get("username"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    position: formData.get("position"),
    salary: parseFloat(formData.get("salary")),
    address: formData.get("address"),

  };

  // API call to backend
  try {
    const response = await fetch("http://localhost:3000/admin/staff/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(staffData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Staff added successfully!");
      staffForm.reset(); // Clear the form
      modal.style.display = "none"; // Close the modal
      fetchStaffList();
    } else {
      throw new Error(result.message || "Failed to add staff");
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error("Error adding staff:", error);
  }
});

// Close modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});