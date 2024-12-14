const profileButton = document.querySelector(".manage-account");
profileButton.addEventListener("click", () => {
  window.location.href = "../Profile/profile.html";
});

const historyButton = document.querySelector("#btn-history");
historyButton.addEventListener("click", () => {
  window.location.href = "../History/history.html";
});

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "../login/login.html";
});
