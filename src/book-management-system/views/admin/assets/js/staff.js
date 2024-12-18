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
        <td>${staff.name}</td>
        <td>${staff.gender}</td>
        <td>${staff.position}</td>
        <td>${staff.salary}</td>
        <td>
          <button class="status inProgress" style="cursor: pointer;" onclick="editStaff('${
            staff._id
          }')">Edit</button>
          <button class="status return" style="cursor: pointer;" onclick="deleteStaff('${
            staff._id
          }')">Delete</button>
        </td>
      </tr>
    `;
  });
};

// Add or Update Staff
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newStaff = {
    name: nameInput.value,
    gender: genderInput.value,
    position: positionInput.value,
    salary: salaryInput.value,
    avatar:
      "https://images.pexels.com/photos/60597/dahlia-red-blossom-bloom-60597.jpeg?auto=compress&cs=tinysrgb&w=600", // Ảnh mặc định
    // avatar: avatarInput.value || null,
  };

  try {
    const response = editStaffId
      ? await fetch(`${API_BASEADMIN_URL}/staff/${editStaffId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStaff),
        })
      : await fetch(`${API_BASEADMIN_URL}/staff/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStaff),
        });

    if (!response.ok) throw new Error("Failed to save staff");

    await fetchStaffList(); // Fetch lại dữ liệu mới
    closeModal();
  } catch (error) {
    console.error("Error saving staff:", error);
  }
});

// Edit Staff
const editStaff = (id) => {
  const staff = staffList.find((s) => s._id === id);
  if (staff) {
    nameInput.value = staff.name;
    genderInput.value = staff.gender;
    positionInput.value = staff.position;
    salaryInput.value = staff.salary;

    editStaffId = id;
    modalTitle.textContent = "Edit Staff";
    openModal();
  }
};

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
