const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  // Lấy tất cả nội dung tab
  const tabContents = document.querySelectorAll(".tab-content");

  // Gán sự kiện click cho từng nút tab
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Xóa lớp 'active' khỏi tất cả các nút tab
      tabButtons.forEach((btn) => btn.classList.remove("active"));

      // Thêm lớp 'active' vào tab được nhấp
      button.classList.add("active");

      // Ẩn tất cả nội dung tab
      tabContents.forEach((content) => content.classList.remove("active"));

      // Hiển thị nội dung của tab được chọn
      document.getElementById(targetTab).classList.add("active");
    });
  });

  // Lắng nghe sự kiện khi nhấn nút "Edit"
  document.getElementById("editButton").addEventListener("click", function () {
    // Chuyển chế độ sang chỉnh sửa
    const inputs = document.querySelectorAll(
      "#employeeForm input, #employeeForm select"
    );
    inputs.forEach((input) => {
      input.disabled = false; // Bỏ disabled để người dùng có thể chỉnh sửa
    });

    // Hiển thị nút Save và Cancel, ẩn nút Edit
    document.getElementById("saveButton").style.display = "block";
    document.getElementById("cancelButton").style.display = "block";
    document.getElementById("editButton").style.display = "none";
  });

  // Lắng nghe sự kiện khi nhấn nút "Cancel"
  document
    .getElementById("cancelButton")
    .addEventListener("click", function () {
      // Tắt chế độ chỉnh sửa (khôi phục lại trạng thái ban đầu)
      const inputs = document.querySelectorAll(
        "#employeeForm input, #employeeForm select"
      );
      inputs.forEach((input) => {
        input.disabled = true; // Đặt lại trạng thái disabled
      });

      // Ẩn nút Save và Cancel, hiển thị lại nút Edit
      document.getElementById("saveButton").style.display = "none";
      document.getElementById("cancelButton").style.display = "none";
      document.getElementById("editButton").style.display = "inline-block";
    });

  // Lắng nghe sự kiện khi nhấn nút "Save"
  document
    .getElementById("saveButton")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Ngừng hành động submit của form

      // Lấy các giá trị người dùng đã chỉnh sửa
      const name = document.getElementById("name").value;
      const dateOfBirth = document.getElementById("dateOfBirth").value;
      const gender = document.getElementById("gender").value;
      const phone = document.getElementById("phone").value;
      const address = document.getElementById("address").value;
      const avatar = document.getElementById("photoPreview").value;

      // Giả sử bạn gửi dữ liệu này đến server để lưu (bằng AJAX, hoặc gửi qua API...)
      // console.log("Saved Data:", { name, dateOfBirth, gender, phone, address });
      editInfo(name, dateOfBirth, gender, phone, address, avatar);
      // Sau khi lưu xong, bạn có thể cập nhật giao diện (nếu cần)
      // Chuyển sang chế độ xem (read-only)
      const inputs = document.querySelectorAll(
        "#employeeForm input, #employeeForm select"
      );
      inputs.forEach((input) => {
        input.disabled = true; // Đặt lại trạng thái disabled
      });

      // Ẩn nút Save và Cancel, hiển thị lại nút Edit
      document.getElementById("saveButton").style.display = "none";
      document.getElementById("cancelButton").style.display = "none";
      document.getElementById("editButton").style.display = "inline-block";
    });

  ///////////////////////////////////////////////
  //get thong tin nguoi dung tu database
  // Hàm lấy thông tin người dùng từ API
  async function fetchInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/get-info`, {
        method: "GET",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userData = await response.json();
      // console.log(userData);
      // Hiển thị thông tin người dùng vào các trường trong form
      document.getElementById("name").value = userData.fullName;
      document.getElementById("dateOfBirth").value = userData.dateOfBirth;
      document.getElementById("gender").value = userData.gender;
      document.getElementById("phone").value = userData.phone;
      document.getElementById("address").value = userData.address;
      document.getElementById("photoPreview").src =
        userData.avatar ||
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&h=500";
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  // Hàm để chỉnh sửa thông tin người dùng
  async function editInfo(name, dateOfBirth, gender, phone, address, avatar) {
    // Tạo đối tượng chứa thông tin người dùng
    const updatedData = {
      fullName: name,
      dateOfBirth: dateOfBirth,
      gender: gender,
      phone: phone,
      address: address,
      avatar: avatar, // Chỉ cần lấy URL avatar hiện tại (hoặc upload ảnh mới và lấy URL)
    };

    try {
      const response = await fetch(`${API_BASE_URL}/profile/edit-info`, {
        method: "PUT",
        headers: {
          authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user info");
      }

      const result = await response.json();
      console.log("User info updated:", result);

      // Hiển thị thông báo hoặc cập nhật giao diện sau khi lưu thành công
      alert("User info updated successfully!");
      fetchInfo(); // Tải lại thông tin người dùng để cập nhật giao diện
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  }
  fetchInfo();
});

// upload anh va luu vao dtb

const changePhotoButton = document.getElementById("changePhotoButton");
changePhotoButton.addEventListener("click", () => {
  photoUpload.click();
});

const photoUpload = document.getElementById("photoUpload");
const photoPreview = document.getElementById("photoPreview");

photoUpload.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  console.log(file);
  if (file) {
    try {
      // Upload ảnh và nhận URL từ Cloudinary
      const imageUrl = await uploadImageWithSignature(file);
      console.log("Image URL:", imageUrl);

      // Hiển thị ảnh mới
      photoPreview.src = imageUrl;

      // Gửi URL ảnh đến backend để lưu vào database
      await savePhotoToDatabase(imageUrl);
    } catch (error) {
      alert("Failed to upload photo. Please try again.");
    }
  }
});

// Hàm lưu URL ảnh vào database
async function savePhotoToDatabase(photoUrl) {
  const updatedData = {
    avatar: photoUrl,
  };
  try {
    const response = await fetch(`${API_BASE_URL}/profile/edit-info`, {
      method: "PUT",
      headers: {
        authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to save photo URL to the database.");
    }

    console.log("Photo URL saved to database.");
  } catch (error) {
    console.error("Error saving photo URL:", error);
  }
}

// change passwork
document.addEventListener("DOMContentLoaded", () => {
  const changePasswordForm = document.getElementById("securityForm");
  const changePasswordButton = document.getElementById("changePasswordButton");

  // Lắng nghe sự kiện submit form
  changePasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Ngăn hành động submit mặc định

    // Lấy giá trị từ form
    const currentPassword = document
      .getElementById("currentPassword")
      .value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có khớp không
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      // Gửi dữ liệu lên server bằng fetch
      const response = await fetch(
        `${API_BASE_URL}/api/client/change-password`,
        {
          method: "POST",
          headers: {
            authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      // Xử lý kết quả trả về từ server
      if (response.ok) {
        alert("Password changed successfully!");
        // Reset form sau khi thành công
        changePasswordForm.reset();
      } else {
        alert(data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred while changing the password. Please try again.");
    }
  });
});
