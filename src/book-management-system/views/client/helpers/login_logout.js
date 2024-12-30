window.initializeProfileModals = () => {
    const userIcon = document.querySelector(".user-icon"); // Biểu tượng người dùng
    const loggedOutProfile = document.querySelector("#logged-out-profile"); // Modal khi chưa đăng nhập
    const loggedInProfile = document.querySelector("#logged-in-profile"); // Modal khi đã đăng nhập
    const closeBtns = document.querySelectorAll(".close-btn"); // Nút đóng của modal
  
    // Kiểm tra token từ localStorage
    const token = localStorage.getItem("token");
  
    // Ẩn modal khi mới tải trang
    loggedOutProfile.style.display = "none";
    loggedInProfile.style.display = "none";
  
    // Function to toggle the profile modal visibility
    const toggleProfileModal = () => {
      if (token) {
        loggedInProfile.style.display =
          loggedInProfile.style.display === "none" ||
          loggedInProfile.style.display === ""
            ? "flex"
            : "none";
        loggedOutProfile.style.display = "none";
      } else {
        loggedOutProfile.style.display =
          loggedOutProfile.style.display === "none" ||
          loggedOutProfile.style.display === ""
            ? "flex"
            : "none";
        loggedInProfile.style.display = "none";
      }
    };
  
    // Hiển thị modal khi người dùng bấm vào icon
    userIcon.addEventListener("click", (event) => {
      event.preventDefault();
      toggleProfileModal();
    });
  
    // Đóng modal khi người dùng bấm vào nút đóng (x)
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        loggedOutProfile.style.display = "none";
        loggedInProfile.style.display = "none";
      });
    });
  
    // Đóng modal khi người dùng bấm ra ngoài modal
    document.addEventListener("click", (event) => {
      if (
        !loggedOutProfile.contains(event.target) &&
        !loggedInProfile.contains(event.target) &&
        !userIcon.contains(event.target)
      ) {
        loggedOutProfile.style.display = "none";
        loggedInProfile.style.display = "none";
      }
    });
  };