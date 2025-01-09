const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      tabButtons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      tabContents.forEach((content) => content.classList.remove("active"));

      document.getElementById(targetTab).classList.add("active");
    });
  });

  document.getElementById("editButton").addEventListener("click", function () {
    const inputs = document.querySelectorAll(
      "#employeeForm input, #employeeForm select"
    );
    inputs.forEach((input) => {
      input.disabled = false;
    });

    document.getElementById("saveButton").style.display = "block";
    document.getElementById("cancelButton").style.display = "block";
    document.getElementById("editButton").style.display = "none";
  });

  document
    .getElementById("cancelButton")
    .addEventListener("click", function () {
      const inputs = document.querySelectorAll(
        "#employeeForm input, #employeeForm select"
      );
      inputs.forEach((input) => {
        input.disabled = true;
      });

      document.getElementById("saveButton").style.display = "none";
      document.getElementById("cancelButton").style.display = "none";
      document.getElementById("editButton").style.display = "inline-block";
    });

  document
    .getElementById("saveButton")
    .addEventListener("click", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const dateOfBirth = document.getElementById("dateOfBirth").value;
      const gender = document.getElementById("gender").value;
      const phone = document.getElementById("phone").value;
      const address = document.getElementById("address").value;
      const avatar = document.getElementById("photoPreview").value;

      editInfo(name, dateOfBirth, gender, phone, address, avatar);
      const inputs = document.querySelectorAll(
        "#employeeForm input, #employeeForm select"
      );
      inputs.forEach((input) => {
        input.disabled = true;
      });

      document.getElementById("saveButton").style.display = "none";
      document.getElementById("cancelButton").style.display = "none";
      document.getElementById("editButton").style.display = "inline-block";
    });

  async function fetchInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/get-info`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userData = await response.json();
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

  async function editInfo(name, dateOfBirth, gender, phone, address, avatar) {
    const updatedData = {
      fullName: name,
      dateOfBirth: dateOfBirth,
      gender: gender,
      phone: phone,
      address: address,
      avatar: avatar,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/profile/edit-info`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user info");
      }

      const result = await response.json();

      alert("User info updated successfully!");
      fetchInfo();
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  }
  fetchInfo();
});

const changePhotoButton = document.getElementById("changePhotoButton");
changePhotoButton.addEventListener("click", () => {
  photoUpload.click();
});

const photoUpload = document.getElementById("photoUpload");
const photoPreview = document.getElementById("photoPreview");

photoUpload.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const imageUrl = await uploadImageWithSignature(file);

      photoPreview.src = imageUrl;

      await savePhotoToDatabase(imageUrl);
    } catch (error) {
      alert("Failed to upload photo. Please try again.");
    }
  }
});

async function savePhotoToDatabase(photoUrl) {
  const updatedData = {
    avatar: photoUrl,
  };
  try {
    const response = await fetch(`${API_BASE_URL}/profile/edit-info`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to save photo URL to the database.");
    }
  } catch (error) {
    console.error("Error saving photo URL:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const changePasswordForm = document.getElementById("securityForm");
  const changePasswordButton = document.getElementById("changePasswordButton");

  changePasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const currentPassword = document
      .getElementById("currentPassword")
      .value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/client/change-password`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Password changed successfully!");
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

document.addEventListener("DOMContentLoaded", () => {
  page = "profile";
  window.setupPageWebSocket(page);
});
