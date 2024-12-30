let customers = [];
let currentEditId = null;
async function checkToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Bạn chưa đăng nhập!');
    window.location.href = './login/login.html';
    return false;
  }

  try {
    const response = await fetch('http://localhost:3000/staff/auth/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return true; // Token hợp lệ
    } else {
      alert('Token không hợp lệ, vui lòng đăng nhập lại!');
      window.location.href = './login/login.html';
      return false;
    }
  } catch (error) {
    console.error('Lỗi khi xác thực token:', error);
    alert('Đã xảy ra lỗi khi xác thực token!');
    window.location.href = './login/login.html';
    return false;
  }
}
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
async function fetchCustomers(page = 1) {
  if (!(await checkToken())) return;
  try {
    const response = await fetch(
      `http://localhost:3000/profile/getUser?page=${page}&limit=5`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    customers = data.users; // Lấy danh sách khách hàng từ API
    renderCustomerTable(); // Hiển thị bảng khách hàng
    renderCustomerPagination(data.totalPages, data.currentPage); // Hiển thị phân trang
  } catch (error) {
    console.error("Error fetching customers:", error);
    alert("Failed to load customer data.");
  }
}
function renderCustomerPagination(totalPages, currentPage) {
  const paginationList = document.getElementById("customerpagination-list");
  paginationList.innerHTML = ""; // Xóa nội dung cũ

  // Nút "Previous"
  const prevButton = document.createElement("li");
  prevButton.innerHTML = `<a href="#topCustomers"><i class="fa-solid fa-chevron-left"></i></a>`;
  if (currentPage === 1) prevButton.classList.add("disabled");
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      fetchCustomers(currentPage - 1);
    }
  });
  paginationList.appendChild(prevButton);

  // Số trang
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("li");
    pageButton.innerHTML = `<a href="#topCustomers">${i}</a>`;
    if (currentPage === i) pageButton.classList.add("current");

    pageButton.addEventListener("click", () => {
      if (currentPage !== i) {
        fetchCustomers(i);
      }
    });
    paginationList.appendChild(pageButton);
  }

  // Nút "Next"
  const nextButton = document.createElement("li");
  nextButton.innerHTML = `<a href="#topCustomers"><i class="fa-solid fa-chevron-right"></i></a>`;
  if (currentPage === totalPages) nextButton.classList.add("disabled");
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      fetchCustomers(currentPage + 1);
    }
  });
  paginationList.appendChild(nextButton);
}
// Initial fetch when the page loads
document.addEventListener("DOMContentLoaded", () => {
  currentPage = 1; // Đặt currentPage về trang đầu tiên
  fetchCustomers(currentPage); // Gọi fetchCustomers và truyền currentPage vào
});


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