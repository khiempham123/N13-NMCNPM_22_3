document.addEventListener("DOMContentLoaded", () => {
    const userIcon = document.querySelector(".user-icon");
    const profileCard = document.querySelector(".profile-card");
    const closeBtn = document.querySelector(".close-btn");

    // Hiển thị/hide khi click vào icon
    userIcon.addEventListener("click", (event) => {
        event.preventDefault();
        profileCard.style.display = profileCard.style.display === "none" || profileCard.style.display === "" ? "block" : "none";
    });

    // Đóng khi click vào nút đóng
    closeBtn.addEventListener("click", () => {
        profileCard.style.display = "none";
    });

    // Ẩn profile-card khi click ngoài khu vực
    document.addEventListener("click", (event) => {
        if (!profileCard.contains(event.target) && !userIcon.contains(event.target)) {
            profileCard.style.display = "none";
        }
    });
});