
const hamburgerMenuCheckbox = document.querySelector("[data-hamburger-menu-checkbox]")
hamburgerMenuCheckbox.checked = false;
const foldersNavbar = document.querySelector("[data-folders-navbar]")

const blackout = document.createElement("div")
blackout.style.backgroundColor = "RGBA(0, 0, 0, 0.8)"
blackout.style.zIndex = 3
blackout.style.position = "absolute"
blackout.style.width = "100dvw"
blackout.style.height = "100dvh"
blackout.style.top = 0
blackout.style.right = 0


function handleHamburgerMenu() {
    if (hamburgerMenuCheckbox.checked) {
        foldersNavbar.classList.add("active")
        hamburgerMenuCheckbox.classList.add("active")
        document.body.appendChild(blackout)
    } else {
        foldersNavbar.classList.remove("active")
        hamburgerMenuCheckbox.classList.remove("active")

        document.body.removeChild(blackout)
    }


}

blackout.addEventListener("click", () => {
    hamburgerMenuCheckbox.checked = false
    handleHamburgerMenu()

})

hamburgerMenuCheckbox.addEventListener("click", handleHamburgerMenu)



