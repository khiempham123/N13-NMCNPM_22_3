// Mảng lưu trữ dữ liệu khách hàng
let customers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    birthDay: "1990-01-01",
    email: "nguyenvana123@gmail.com",
  },
  {
    id: 2,
    name: "Nguyễn Văn B",
    birthDay: "1991-02-02",
    email: "nguyenvanb456@gmail.com",
  },
];

// Hàm hiển thị bảng khách hàng
function renderCustomerTable() {
  const tableBody = document.querySelector("#customerTable tbody");
  tableBody.innerHTML = ""; // Xóa dữ liệu cũ trước khi render lại

  customers.forEach((customer, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${customer.name}</td>
            <td>${customer.birthDay}</td>
            <td>${customer.email}</td>
            <td>
              <button class="edit-btn" data-id="${customer.id}">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn" data-id="${customer.id}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          `;
    tableBody.appendChild(row);
  });
}

// Mở popup thêm khách hàng
document
  .getElementById("openAddCustomerModal")
  .addEventListener("click", function () {
    document.getElementById("addCustomerPopup").style.display = "flex";
  });

// Đóng popup thêm khách hàng
document
  .getElementById("closeAddCustomerPopup")
  .addEventListener("click", function () {
    document.getElementById("addCustomerPopup").style.display = "none";
  });

// Thêm khách hàng mới
document
  .getElementById("addCustomerBtn")
  .addEventListener("click", function () {
    const name = document.getElementById("customerName").value;
    const birthDay = document.getElementById("customerBirthDay").value;
    const email = document.getElementById("customerEmail").value;

    if (name && birthDay && email) {
      const newCustomer = {
        id: customers.length + 1,
        name: name,
        birthDay: birthDay,
        email: email,
      };
      customers.push(newCustomer);
      renderCustomerTable();
      document.getElementById("addCustomerPopup").style.display = "none";
    } else {
      alert("Please fill out all fields.");
    }
  });

// Mở popup chỉnh sửa khách hàng
document.addEventListener("click", function (event) {
  if (event.target.closest(".edit-btn")) {
    const customerId = event.target
      .closest(".edit-btn")
      .getAttribute("data-id");
    const customer = customers.find((c) => c.id == customerId);
    document.getElementById("editCustomerName").value = customer.name;
    document.getElementById("editCustomerBirthDay").value = customer.birthDay;
    document.getElementById("editCustomerEmail").value = customer.email;
    document.getElementById("editCustomerPopup").style.display = "flex";
  }
});

// Đóng popup chỉnh sửa khách hàng
document
  .getElementById("closeEditCustomerPopup")
  .addEventListener("click", function () {
    document.getElementById("editCustomerPopup").style.display = "none";
  });

// Lưu chỉnh sửa thông tin khách hàng
document
  .getElementById("saveEditCustomerBtn")
  .addEventListener("click", function () {
    const id = customers.find(
      (c) =>
        c.id ==
        parseInt(document.querySelector(".edit-btn").getAttribute("data-id"))
    ).id;
    const name = document.getElementById("editCustomerName").value;
    const birthDay = document.getElementById("editCustomerBirthDay").value;
    const email = document.getElementById("editCustomerEmail").value;

    const customer = customers.find((c) => c.id === id);
    customer.name = name;
    customer.birthDay = birthDay;
    customer.email = email;

    renderCustomerTable();
    document.getElementById("editCustomerPopup").style.display = "none";
  });

// Mở popup xóa khách hàng
document.addEventListener("click", function (event) {
  if (event.target.closest(".delete-btn")) {
    const customerId = event.target
      .closest(".delete-btn")
      .getAttribute("data-id");
    document.getElementById("deleteCustomerPopup").style.display = "flex";
    document
      .getElementById("deleteCustomerBtn")
      .setAttribute("data-id", customerId);
  }
});

// Đóng popup xóa khách hàng
document
  .getElementById("closeDeleteCustomerPopup")
  .addEventListener("click", function () {
    document.getElementById("deleteCustomerPopup").style.display = "none";
  });

// Xác nhận xóa khách hàng
document
  .getElementById("deleteCustomerBtn")
  .addEventListener("click", function () {
    const customerId = document
      .getElementById("deleteCustomerBtn")
      .getAttribute("data-id");
    customers = customers.filter((c) => c.id != customerId);
    renderCustomerTable();
    document.getElementById("deleteCustomerPopup").style.display = "none";
  });

// Initial render
renderCustomerTable();
