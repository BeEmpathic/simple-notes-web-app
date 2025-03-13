import { setNote } from "./components/Notes.js"
import Notes from "./components/Notes.js"

const notesWrapper = document.querySelector("[data-notes-wrapper]")

setNote("My first note", "I have no idea what I doing", "blue")



notesWrapper.innerHTML = Notes(JSON.stringify(localStorage.getItem("notes")))
