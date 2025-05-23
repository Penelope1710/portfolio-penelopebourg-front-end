// NAVIGATION
const hamburgerButton = document.querySelector(".nav-toggler");
const navigation = document.querySelector("nav");

const toggleNav = () => {
    hamburgerButton.classList.toggle("active");
    navigation.classList.toggle("active");
};

hamburgerButton.addEventListener("click", toggleNav);

