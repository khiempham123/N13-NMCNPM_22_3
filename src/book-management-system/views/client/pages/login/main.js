const inputs = document.querySelectorAll(".input");


function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}


inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});

const signUpBtnLink=document.querySelector('.signUp-link');
const signInBtnLink=document.querySelector('.signIn-link');
const wrapper=document.querySelector('.wrapper');

signUpBtnLink.addEventListener('click',()=>{
	wrapper.classList.toggle('active');
});

signInBtnLink.addEventListener('click',()=>{
	wrapper.classList.toggle('active');
});

const backHome=document.querySelector('.btn');
backHome.addEventListener('click',()=>{
	window.location.href='../home/home.html';
});
