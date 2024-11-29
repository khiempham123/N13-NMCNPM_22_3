function showStep(step) {
  document.querySelectorAll(".step").forEach(function (stepElement) {
    stepElement.classList.add("hidden");
  });

  document.getElementById("step" + step).classList.remove("hidden");
}

function removeItem(button) {
  button.closest(".item").remove();
}

function togglePaymentDetails(paymentType) {
  document
    .querySelectorAll(".payment-details")
    .forEach(function (detailElement) {
      detailElement.classList.add("hidden");
    });

  if (paymentType === "cash") {
    document.getElementById("cashDetails").classList.remove("hidden");
  } else if (paymentType === "bank") {
    document.getElementById("bankDetails").classList.remove("hidden");
  }
}

function loadWards() {
  // This function would be used to dynamically load wards based on district
}

function validatePaymentForm(event) {
  // Placeholder for validation logic
  return true;
}

function validateDeliveryForm(event) {
  // Placeholder for validation logic
  return true;
}
