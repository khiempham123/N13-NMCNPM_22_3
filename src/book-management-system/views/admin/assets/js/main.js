let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

const addProductModal = document.getElementById("addProductModal");
const addProductBtn = document.getElementById("btn-addproduct");
const closeBtn = document.getElementsByClassName("close")[0];

window.addEventListener("click", (event) => {
  if (event.target == addProductModal) {
    addProductModal.style.display = "none";
  }
});
