// nút nhấn edit
document.addEventListener("DOMContentLoaded", () => {
  const editButton = document.getElementById("editButton");
  const cancelButton = document.getElementById("cancelButton");
  const saveButton = document.getElementById("saveButton");
  if (editButton) {
    editButton.addEventListener("click", () => {
      window.location.href = "./editProfile.html";
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      console.log("cancel");
      window.location.href = "./profile.html";
    });
  }

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      window.location.href = "./profile.html";
    });
  }
});
