const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
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

      // Khôi phục lại giá trị ban đầu (nếu cần)
      document.getElementById("name").value = "John Doe";
      document.getElementById("dateOfBirth").value = "1990-01-01";
      document.getElementById("gender").value = "male";
      document.getElementById("phone").value = "(123) 456-7890";
      document.getElementById("address").value = "123 Main Street";
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

      // Giả sử bạn gửi dữ liệu này đến server để lưu (bằng AJAX, hoặc gửi qua API...)
      console.log("Saved Data:", { name, dateOfBirth, gender, phone, address });

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

      // Hiển thị thông tin người dùng vào các trường trong form
      document.getElementById("name").value = userData.fullName;
      document.getElementById("dateOfBirth").value = userData.dateOfBirth;
      document.getElementById("gender").value = userData.gender;
      document.getElementById("phone").value = userData.phone;
      document.getElementById("photoPreview").src =
        userData.avatar ||
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&h=500";
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  // Hàm để chỉnh sửa thông tin người dùng
  async function editInfo() {
    // Lấy dữ liệu từ các trường trong form
    const name = document.getElementById("name").value;
    const dateOfBirth = document.getElementById("dateOfBirth").value;
    const gender = document.getElementById("gender").value;
    const phone = document.getElementById("phone").value;
    const avatar = document.getElementById("photoPreview").src; // Giả sử bạn đã upload avatar mới

    // Tạo đối tượng chứa thông tin người dùng
    const updatedData = {
      fullName: name,
      dateOfBirth: dateOfBirth,
      gender: gender,
      phone: phone,
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
});
