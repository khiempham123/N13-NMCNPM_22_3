document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);

  const checkoutBtn = document.getElementById("checkoutButton");
  const paymentSection = document.querySelector(".payment-section");
  const deliverySection = document.querySelector(".delivery-section");
  const btnContinueToDelivery = document.getElementById("continueToDelivery");
  const btnBackToCart = document.getElementById("backToCart");
  const btnBackToPayment = document.getElementById("backToPayment");
  const blurElements = document.querySelectorAll(".blur");

  // Thêm phần nhập liệu ngân hàng
  const bankInfoSection = document.getElementById("bankInfoSection");
  const bankTransferRadio = document.getElementById("bankTransfer");
  const cashOnDeliveryRadio = document.getElementById("cashOnDelivery");

  // Kiểm tra khi người dùng chọn phương thức thanh toán
  function handlePaymentMethodChange() {
    if (bankTransferRadio.checked) {
      bankInfoSection.style.display = "block"; // Hiển thị thông tin ngân hàng
    } else {
      bankInfoSection.style.display = "none"; // Ẩn thông tin ngân hàng
    }
  }

  // Lắng nghe thay đổi phương thức thanh toán
  bankTransferRadio.addEventListener("change", handlePaymentMethodChange);
  cashOnDeliveryRadio.addEventListener("change", handlePaymentMethodChange);

  // Khi trang load xong, kiểm tra trạng thái radio button
  handlePaymentMethodChange();

  // Kiểm tra xem người dùng đã nhập thông tin ngân hàng chưa khi tiếp tục đến giao hàng
  btnContinueToDelivery.addEventListener("click", function (e) {
    if (bankTransferRadio.checked) {
      const accountNumber = document.getElementById("accountNumber").value;
      if (accountNumber.trim() === "") {
        alert("Please enter your account number to proceed.");
        e.preventDefault();
        return;
      }
    }
    deliverySection.classList.add("active");
  });

  btnContinueToDelivery.addEventListener("click", function () {
    if (cashOnDeliveryRadio.checked) {
      deliverySection.classList.add("active");
    }
  });

  // Hiển thị phần thanh toán
  checkoutBtn.addEventListener("click", function () {
    paymentSection.classList.add("active");
    overlay.classList.add("active");
  });

  // Chuyển đến phần giao hàng

  // Quay lại phần thanh toán
  btnBackToCart.addEventListener("click", function () {
    paymentSection.classList.remove("active");
    overlay.classList.remove("active");
    blurElements.forEach((el) => el.classList.remove("blur"));
  });

  btnBackToPayment.addEventListener("click", function () {
    deliverySection.classList.remove("active");
    paymentSection.classList.add("active");
  });

  // Ẩn overlay và các phần modal khi nhấn ra ngoài
  overlay.addEventListener("click", function () {
    paymentSection.classList.remove("active");
    deliverySection.classList.remove("active");
    overlay.classList.remove("active");
  });

  // fetch city district, ward
  const citySelect = document.getElementById("city");
  const districtSelect = document.getElementById("district");
  const wardSelect = document.getElementById("ward");


  // Hàm lấy thông tin thành phố từ API
  async function fetchCities() {
    try {
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const cities = await response.json();
      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.code;
        option.textContent = city.name;
        citySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }

  // Hàm lấy thông tin quận huyện theo thành phố
  async function fetchDistricts(cityCode) {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
      );
      const cityData = await response.json();
      districtSelect.innerHTML =
        "<option selected>--Select District--</option>"; // reset districts
      cityData.districts.forEach((district) => {
        const option = document.createElement("option");
        option.value = district.code;
        option.textContent = district.name;
        districtSelect.appendChild(option);
      });
      districtSelect.disabled = false; // enable district select
      wardSelect.disabled = true; // reset ward select
      wardSelect.innerHTML = "<option selected>--Select Ward--</option>"; // reset ward options
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  }

  // Hàm lấy thông tin phường xã theo quận huyện
  async function fetchWards(districtCode) {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      const districtData = await response.json();
      //   console.log(districtData);
      wardSelect.innerHTML = "<option selected>--Select Ward--</option>"; // reset wards
      console.log(districtData.wards);
      districtData.wards.forEach((ward) => {
        const option = document.createElement("option");
        option.value = ward.code;
        option.textContent = ward.name;
        wardSelect.appendChild(option);
      });
      wardSelect.disabled = false; // enable ward select
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  }

  // Lắng nghe sự kiện chọn thành phố
  citySelect.addEventListener("change", function () {
    const cityCode = citySelect.value;
    if (cityCode !== "Select City") {
      fetchDistricts(cityCode);
    }
  });

  // Lắng nghe sự kiện chọn quận huyện
  districtSelect.addEventListener("change", function () {
    const districtCode = districtSelect.value;
    console.log(districtCode);
    if (districtCode !== "Select District") {
      fetchWards(districtCode);
    }
  });

  // Tải danh sách thành phố khi trang được tải
  fetchCities();
});
