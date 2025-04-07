const hamburgerMenuCheckbox = document.querySelector("[data-hamburger-menu-checkbox]")
const foldersNavbar = document.querySelector("[data-folders-navbar]")
hamburgerMenuCheckbox.addEventListener("click", () => {
    console.log("Hamburger been clicked")
    foldersNavbar.classList.toggle("active")
})

foldersNavbar.addEventListener("blur", () => {
    console.log("blur was fired")
    foldersNavbar.classList.toggle("active")
})