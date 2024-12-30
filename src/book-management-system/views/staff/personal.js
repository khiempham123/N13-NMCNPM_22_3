
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
          authorization: `Bearer ${token}`,
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
    
  async function fetchStaffInfo() {
    if (!(await checkToken())) return;
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage hoặc session
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
   
      // Hiển thị thông tin nhân viên lên HTML
      document.querySelector(".profile-info .info p:nth-child(1) span").textContent = `Name: ${staff.fullName}`;
      document.querySelector(".profile-info .info p:nth-child(2) span").textContent = `BirthDay: ${staff.dateOfBirth.split("T")[0]}`; // Chỉ lấy ngày từ chuỗi ISO
      document.querySelector(".profile-info .info p:nth-child(3) span").textContent = `Phone: ${staff.phone}`;
      document.querySelector(".profile-info .info p:nth-child(4) span").textContent = `Email: ${staff.email}`;
      document.querySelector(".profile-info .info p:nth-child(5) span").textContent = `Address: ${staff.address}`;
      
      // Hiển thị thông tin Operations
      document.querySelector(".profile-info .col-xl-6:nth-child(2) .info p:nth-child(1) span").textContent = `Gender: ${staff.gender}`;
      document.querySelector(".profile-info .col-xl-6:nth-child(2) .info p:nth-child(2) span").textContent = `Salary: ${staff.salary.toLocaleString()} $`;
      document.querySelector(".profile-info .col-xl-6:nth-child(2) .info p:nth-child(3) span").textContent = `Position: ${staff.position}`;
      const avatarImg = document.getElementById("avatar"); // Thẻ <img> hiển thị avatar
        avatarImg.src = staff.avatar || "assets/images/default-avatar.jpg"; // Hiển thị avatar hoặc ảnh mặc định
        avatarImg.alt = `${staff.name}'s Avatar`; // Cập nhật thuộc tính alt
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

      alert('Cập nhật thông tin thành công!');
      editPersonalPopup.style.display = 'none'; // Ẩn popup sau khi cập nhật
      // Cập nhật thông tin hiển thị mà không reload trang
      document.querySelector(".profile-info .info p:nth-child(1) span").textContent = `Name: ${result.updatedStaff.fullName}`;
      document.querySelector(".profile-info .info p:nth-child(2) span").textContent = `BirthDay: ${result.updatedStaff.dayOfBirth.split('T')[0]}`;
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


  document.getElementById('avatar').addEventListener('click', () => {
    document.getElementById('changeAvatarPopup').style.display = 'flex';
    
  });
  
  document.getElementById('closeAvatarPopup').addEventListener('click', () => {
    document.getElementById('changeAvatarPopup').style.display = 'none';
  });
  
  const avatarDropdown = document.getElementById('avatarDropdown');
  const changeAvatarOption = document.getElementById('changeAvatar');
  const avatarPopup = document.getElementById('changeAvatarPopup'); // Popup đổi avatar

  // Hàm mở popup đổi avatar
  function openAvatarPopup() {
    avatarPopup.style.display = 'block'; // Hiển thị popup
  }

  // Gắn sự kiện cho mục "Change Your Avatar"
  changeAvatarOption.addEventListener('click', () => {
    openAvatarPopup(); // Gọi hàm mở popup
  });

  // Đóng dropdown khi click bên ngoài
  document.addEventListener('click', (event) => {
    if (!avatarDropdown.contains(event.target)) {
      avatarDropdown.style.display = 'none'; // Ẩn dropdown
    }
  });

  // Mở dropdown khi nhấn vào avatar
  document.getElementById('avatar').addEventListener('click', (event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện nổi lên
    avatarDropdown.style.display = avatarDropdown.style.display === 'block' ? 'none' : 'block';
  });
  document.getElementById('uploadAvatarBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('avatarFileInput');
    const file = fileInput.files[0];
  
    if (!file) {
      alert('Please select an image.');
      return;
    }
  
    try {
      // Sử dụng hàm uploadImageWithSignature để upload ảnh
      const avatarUrl = await uploadImageWithSignature(file);
  
      // Gửi yêu cầu cập nhật avatar
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      if (!token) {
        alert('Please log in first.');
        window.location.href = './login/login.html';
        return;
      }
  
      const updateResponse = await fetch('http://localhost:3000/staff/profile/avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: avatarUrl }), // Gửi URL avatar đến API
      });
  
      if (!updateResponse.ok) {
        throw new Error('Failed to update avatar.');
      }
  
      const result = await updateResponse.json();
      alert('Avatar updated successfully!');
  
      // Cập nhật hiển thị avatar
      document.getElementById('avatar').src = avatarUrl;
      document.getElementById('changeAvatarPopup').style.display = 'none';
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Failed to change avatar. Please try again.');
    }
  });



})
  