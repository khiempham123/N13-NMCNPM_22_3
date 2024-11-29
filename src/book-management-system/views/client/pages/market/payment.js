document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);

    const checkoutBtn = document.getElementById("checkoutBtn");
    const paymentSection = document.querySelector(".payment-section");
    const deliverySection = document.querySelector(".delivery-section");
    const btnContinueToDelivery = document.querySelector(".btn-continue");
    const btnBackToPayment = document.querySelector(".btn-back");
    const blurElements = document.querySelectorAll(".blur");

    // Hiển thị phần thanh toán
    checkoutBtn.addEventListener("click", function () {
        paymentSection.classList.add("active");
        overlay.classList.add("active");
        blurElements.forEach((el) => el.classList.add("blur"));
    });

    // Chuyển đến phần giao hàng
    btnContinueToDelivery.addEventListener("click", function () {
        paymentSection.classList.remove("active");
        deliverySection.classList.add("active");
    });

    // Quay lại phần thanh toán
    btnBackToPayment.addEventListener("click", function () {
        deliverySection.classList.remove("active");
        paymentSection.classList.add("active");
    });

    // Ẩn overlay và các phần modal khi nhấn ra ngoài
    overlay.addEventListener("click", function () {
        paymentSection.classList.remove("active");
        deliverySection.classList.remove("active");
        overlay.classList.remove("active");
        blurElements.forEach((el) => el.classList.remove("blur"));
    });
});