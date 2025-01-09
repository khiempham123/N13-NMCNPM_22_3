document.addEventListener("DOMContentLoaded", () => {
  const userIcon = document.querySelector(".user-icon");
  const profileCard = document.querySelector(".profile-card");
  const closeBtn = document.querySelector(".close-btn");

  userIcon.addEventListener("click", (event) => {
    event.preventDefault();
    profileCard.style.display =
      profileCard.style.display === "none" || profileCard.style.display === ""
        ? "block"
        : "none";
  });

  closeBtn.addEventListener("click", () => {
    profileCard.style.display = "none";
  });

  document.addEventListener("click", (event) => {
    if (
      !profileCard.contains(event.target) &&
      !userIcon.contains(event.target)
    ) {
      profileCard.style.display = "none";
    }
  });
});
