function navigateTo(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.classList.add("active");
  }

  document.querySelectorAll(".sidebar ul li a").forEach((link) => {
    link.classList.remove("active");
  });

  const selectedLink = document.querySelector(
    `.sidebar ul li a[href="#${pageId}"]`
  );
  if (selectedLink) {
    selectedLink.classList.add("active");
  }
}
