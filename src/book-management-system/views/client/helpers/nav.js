// Lắng nghe sự kiện click trên các liên kết navbar
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

navLinks.forEach((link) => {
  link.addEventListener("click", async (event) => {
    event.preventDefault();
    const target = event.target.textContent.trim();

    switch (target) {
      case "Home":
        window.location.href = "./home.html";
        break;
      case "Book":
        window.location.href = "../shop/shop.html";
        break;
      case "Author":
        window.location.href = "/authors.html";
        break;
      case "Blog":
        window.location.href = "/blog.html";
        break;
      case "Contact":
        window.location.href = "/contact.html";
        break;
      default:
        console.error("Unhandled link:", target);
    }
  });
});
