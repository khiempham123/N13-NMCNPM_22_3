const API_BASEADMIN_URL = "http://localhost:3000/admin";

const fetchCustomers = async () => {
  try {
    const response = await fetch(`${API_BASEADMIN_URL}/customer`);
    if (!response.ok) {
      throw new Error("Failed to fetch customer data");
    }
    const customers = await response.json();
    renderCustomers(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
  }
};

const renderCustomers = (customers) => {
  const tableBody = document.getElementById("customerTableBody");
  tableBody.innerHTML = ""; 

  customers.forEach((customer) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${customer.fullName || "N/A"}</td>
        <td>${customer.phone}</td>
        <td>${customer.address || "N/A"}</td>
        <td>${customer.totalOrders} Orders</td>
        <td>${customer.totalAmount}$</td>
        <td>
          <span class="status delivered" style="cursor: pointer;" onclick="handleReset('${
            customer._id
          }')">Reset</span>
          <span class="status return" style="cursor: pointer;" onclick="handleDelete('${
            customer._id
          }')">Delete</span>
        </td>
      `;

    tableBody.appendChild(tr);
  });
};

const handleReset = async (id) => {
  const isConfirm = confirm(
    "Are you sure you want to reset the password for this customer?"
  );
  if (!isConfirm) return;

  try {
    const response = await fetch(
      `${API_BASEADMIN_URL}/customer/${id}/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isConfirm: true }),
      }
    );

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      fetchCustomers(); 
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    alert("Failed to reset password.");
  }
};

const handleDelete = async (id) => {
  const isConfirm = confirm("Are you sure you want to delete this customer?");
  if (!isConfirm) return;

  try {
    const response = await fetch(`${API_BASEADMIN_URL}/customer/${id}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isConfirm: true }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      fetchCustomers();
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    alert("Failed to delete customer.");
  }
};

document.addEventListener("DOMContentLoaded", fetchCustomers);



