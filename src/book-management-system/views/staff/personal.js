
document.addEventListener('DOMContentLoaded', () => {
  const openEditPersonalBtn = document.getElementById('openEditPersonalModal'); // Nút mở popup
  const closeEditPersonalBtn = document.getElementById('closeEditPersonalPopup'); // Nút đóng popup
  const editPersonalPopup = document.getElementById('editPersonalPopup');
  // Hàm mở popup
  function showPopup() {
    editPersonalPopup.style.display = 'flex'; // Hiển thị popup
  }

  // Hàm đóng popup
  function hidePopup() {
    editPersonalPopup.style.display = 'none'; // Ẩn popup
  }

  // Thêm sự kiện mở popup
  openEditPersonalBtn.addEventListener('click', showPopup);

  // Thêm sự kiện đóng popup
  closeEditPersonalBtn.addEventListener('click', hidePopup);

  // Đóng popup khi nhấn bên ngoài
  window.addEventListener('click', (event) => {
    if (event.target === editPersonalPopup) {
      hidePopup();
    }
  });
  async function checkToken() {
    const token = localStorage.getItem('token');
    console.log(token)
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
      window.location.href = 'login.html';
      return false;
    }
  }
    
  async function fetchStaffInfo() {
    if (!(await checkToken())) return;
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage hoặc session
      console.log(token)
      const response = await fetch("http://localhost:3000/staff/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch staff info");
      }
  
      const staff = await response.json();
      console.log("Staff Info:", staff);
      console.log(staff.name)
      // Hiển thị thông tin nhân viên lên HTML
      document.querySelector(".profile-info .info p:nth-child(1) span").textContent = `Name: ${staff.name}`;
      document.querySelector(".profile-info .info p:nth-child(2) span").textContent = `BirthDay: ${staff.birthDay.split("T")[0]}`; // Chỉ lấy ngày từ chuỗi ISO
      document.querySelector(".profile-info .info p:nth-child(3) span").textContent = `Phone: ${staff.phone}`;
      document.querySelector(".profile-info .info p:nth-child(4) span").textContent = `Email: ${staff.email}`;
      document.querySelector(".profile-info .info p:nth-child(5) span").textContent = `Address: ${staff.address}`;
      
      // Hiển thị thông tin Operations
      document.querySelector(".profile-info .col-xl-6:nth-child(2) .info p:nth-child(1) span").textContent = `On-position: ${staff.position}`;
      document.querySelector(".profile-info .col-xl-6:nth-child(2) .info p:nth-child(2) span").textContent = `Salary: ${staff.salary.toLocaleString()} vnđ`;
      document.querySelector(".profile-info .col-xl-6:nth-child(2) .info p:nth-child(3) span").textContent = `Role: ${staff.role}`;
    } catch (error) {
      console.error(error);
    }
  }
  document.getElementById("personals").addEventListener("click", () => {
    fetchStaffInfo(); // Chỉ gọi hàm fetchBooks khi nhấn vào trang Books
  });

  const updatePersonalBtn = document.getElementById('updateEditPersonalPopup'); // Nút Update
  async function updatePersonalInfo() {
    if (!(await checkToken())) return;
    try {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      if (!token) {
        alert('Bạn chưa đăng nhập!');
        window.location.href = './login/login.html';
        return;
      }

      // Lấy dữ liệu từ form
      const updatedData = {
        name: document.getElementById('staffName').value,
        birthDay: document.getElementById('staffBirthDay').value,
        phone: document.getElementById('staffPhone').value,
        email: document.getElementById('staffEmail').value,
        address: document.getElementById('staffAddress').value,
      };

      console.log('Dữ liệu gửi đi:', updatedData);

      // Gửi yêu cầu cập nhật
      const response = await fetch('http://localhost:3000/staff/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Cập nhật thông tin thất bại');
      }

      const result = await response.json();
      console.log('Kết quả cập nhật:', result);

      alert('Cập nhật thông tin thành công!');
      editPersonalPopup.style.display = 'none'; // Ẩn popup sau khi cập nhật
      // Cập nhật thông tin hiển thị mà không reload trang
      document.querySelector(".profile-info .info p:nth-child(1) span").textContent = `Name: ${result.updatedStaff.name}`;
      document.querySelector(".profile-info .info p:nth-child(2) span").textContent = `BirthDay: ${result.updatedStaff.birthDay.split('T')[0]}`;
      document.querySelector(".profile-info .info p:nth-child(3) span").textContent = `Phone: ${result.updatedStaff.phone}`;
      document.querySelector(".profile-info .info p:nth-child(4) span").textContent = `Email: ${result.updatedStaff.email}`;
      document.querySelector(".profile-info .info p:nth-child(5) span").textContent = `Address: ${result.updatedStaff.address}`;
      
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Đã xảy ra lỗi khi cập nhật thông tin!');
    }
  }

  // Gắn sự kiện vào nút Update
  updatePersonalBtn.addEventListener('click', updatePersonalInfo);



})
  






