window.initializeProfileModals = () => {
    const userIcon = document.querySelector(".user-icon");
    const loggedOutProfile = document.querySelector("#logged-out-profile");
    const loggedInProfile = document.querySelector("#logged-in-profile");
    const closeBtns = document.querySelectorAll(".close-btn");
  
    const token = localStorage.getItem("token");
  
    loggedOutProfile.style.display = "none";
    loggedInProfile.style.display = "none";
  
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
  
    userIcon.addEventListener("click", (event) => {
      event.preventDefault();
      toggleProfileModal();
    });
  
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        loggedOutProfile.style.display = "none";
        loggedInProfile.style.display = "none";
      });
    });
  
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