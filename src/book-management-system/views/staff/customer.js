let customers = [];
let currentEditId = null;

// Hàm hiển thị bảng khách hàng
function renderCustomerTable() {
  const tableBody = document.querySelector("#customerTable tbody");
  tableBody.innerHTML = ""; // Xóa dữ liệu cũ trước khi render lại

  customers.forEach((customer, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${customer.username}</td>
      <td>${customer.fullName}</td>
      <td>${customer.dateOfBirth}</td>
      <td>${customer.email}</td>
      <td>
        <button class="edit-btn" data-id="${customer._id}">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete-btn" data-id="${customer._id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Fetch customers from the backend API
async function fetchCustomers() {
  try {
    const response = await fetch("http://localhost:3000/profile/getUser");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    customers = await response.json();
    renderCustomerTable();
  } catch (error) {
    console.error("Error fetching customers:", error);
    alert("Failed to load customer data.");
  }
}

// Initial fetch when the page loads
document.addEventListener("DOMContentLoaded", fetchCustomers);


// Mở popup chỉnh sửa khách hàng
document.addEventListener("click", (event) => {
  const editBtn = event.target.closest(".edit-btn");
  if (editBtn) {
    const customerId = editBtn.getAttribute("data-id");
    const customer = customers.find((c) => c._id == customerId);
    if (customer) {
      currentEditId = customer._id;
      document.getElementById("editCustomerName").value = customer.fullName;
      document.getElementById("editCustomerBirthDay").value = customer.dateOfBirth;
      document.getElementById("editCustomerEmail").value = customer.email;
      document.getElementById("editCustomerPopup").style.display = "flex";
    }
  }
});

// Đóng popup chỉnh sửa khách hàng
document.getElementById("closeEditCustomerPopup").addEventListener("click", () => {
  document.getElementById("editCustomerPopup").style.display = "none";
  currentEditId = null;
});

// Lưu chỉnh sửa thông tin khách hàng
document.getElementById("saveEditCustomerBtn").addEventListener("click", async () => {
  if (!currentEditId) {
    alert("No customer selected for editing.");
    return;
  }

  const name = document.getElementById("editCustomerName").value.trim();
  const birthDay = document.getElementById("editCustomerBirthDay").value;
  const email = document.getElementById("editCustomerEmail").value.trim();

  if (name && birthDay && email) {
    const updatedCustomer = { name, birthDay, email };

    try {
      const response = await fetch(`http://localhost:3000/profile/update/${currentEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCustomer),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const returnedCustomer = await response.json();
      const index = customers.findIndex((c) => c.id === returnedCustomer.id);
      if (index !== -1) {
        customers[index] = returnedCustomer;
        renderCustomerTable();
        document.getElementById("editCustomerPopup").style.display = "none";
        currentEditId = null;
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Failed to update customer.");
    }
  } else {
    alert("Please fill out all fields.");
  }
});

// Mở popup xóa khách hàng
document.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest(".delete-btn");
  if (deleteBtn) {
    const customerId = deleteBtn.getAttribute("data-id");
    document.getElementById("deleteCustomerPopup").style.display = "flex";
    document.getElementById("deleteCustomerBtn").setAttribute("data-id", customerId);
  }
});

// Đóng popup xóa khách hàng
document.getElementById("closeDeleteCustomerPopup").addEventListener("click", () => {
  document.getElementById("deleteCustomerPopup").style.display = "none";
});

// Xác nhận xóa khách hàng
document.getElementById("deleteCustomerBtn").addEventListener("click", async () => {
  const customerId = document.getElementById("deleteCustomerBtn").getAttribute("data-id");

  try {
    const response = await fetch(`http://localhost:3000/profile/delete/${customerId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    customers = customers.filter((c) => c._id != customerId);
    renderCustomerTable();
    document.getElementById("deleteCustomerPopup").style.display = "none";
  } catch (error) {
    console.error("Error deleting customer:", error);
    alert("Failed to delete customer.");
  }
});
