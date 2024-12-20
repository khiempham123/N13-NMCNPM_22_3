function navigateTo(pageId) {
  console.log(pageId)
  // Bỏ class 'active' khỏi tất cả các trang
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  // Thêm class 'active' cho trang được chọn
  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.classList.add("active");
  }

  // Bỏ class 'active' khỏi tất cả các thẻ a trong sidebar
  document.querySelectorAll(".sidebar ul li a").forEach((link) => {
    link.classList.remove("active");
  });

  // Thêm class 'active' cho thẻ a tương ứng
  const selectedLink = document.querySelector(
    `.sidebar ul li a[href="#${pageId}"]`
  );
  if (selectedLink) {
    selectedLink.classList.add("active");
  }
}
