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

  const bankInfoSection = document.getElementById("bankInfoSection");
  const bankTransferRadio = document.getElementById("bankTransfer");
  const cashOnDeliveryRadio = document.getElementById("cashOnDelivery");

  function handlePaymentMethodChange() {
    if (bankTransferRadio.checked) {
      bankInfoSection.style.display = "block";
    } else {
      bankInfoSection.style.display = "none";
    }
  }

  bankTransferRadio.addEventListener("change", handlePaymentMethodChange);
  cashOnDeliveryRadio.addEventListener("change", handlePaymentMethodChange);

  handlePaymentMethodChange();

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

  checkoutBtn.addEventListener("click", function () {
    paymentSection.classList.add("active");
    overlay.classList.add("active");
  });

  btnBackToCart.addEventListener("click", function () {
    paymentSection.classList.remove("active");
    overlay.classList.remove("active");
    blurElements.forEach((el) => el.classList.remove("blur"));
  });

  btnBackToPayment.addEventListener("click", function () {
    deliverySection.classList.remove("active");
    paymentSection.classList.add("active");
  });

  overlay.addEventListener("click", function () {
    paymentSection.classList.remove("active");
    deliverySection.classList.remove("active");
    overlay.classList.remove("active");
  });

  const citySelect = document.getElementById("city");
  const districtSelect = document.getElementById("district");
  const wardSelect = document.getElementById("ward");

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

  async function fetchDistricts(cityCode) {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
      );
      const cityData = await response.json();
      districtSelect.innerHTML =
        "<option selected>--Select District--</option>";
      cityData.districts.forEach((district) => {
        const option = document.createElement("option");
        option.value = district.code;
        option.textContent = district.name;
        districtSelect.appendChild(option);
      });
      districtSelect.disabled = false;
      wardSelect.disabled = true;
      wardSelect.innerHTML = "<option selected>--Select Ward--</option>";
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  }

  async function fetchWards(districtCode) {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      const districtData = await response.json();
      wardSelect.innerHTML = "<option selected>--Select Ward--</option>";
      districtData.wards.forEach((ward) => {
        const option = document.createElement("option");
        option.value = ward.code;
        option.textContent = ward.name;
        wardSelect.appendChild(option);
      });
      wardSelect.disabled = false;
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  }

  citySelect.addEventListener("change", function () {
    const cityCode = citySelect.value;
    if (cityCode !== "Select City") {
      fetchDistricts(cityCode);
    }
  });

  districtSelect.addEventListener("change", function () {
    const districtCode = districtSelect.value;
    if (districtCode !== "Select District") {
      fetchWards(districtCode);
    }
  });

  fetchCities();
});
