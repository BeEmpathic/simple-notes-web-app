import { today } from "../modules/dateFormatter.js"




export function renderNotes() {
    const notesWrapper = document.querySelector("[data-notes-wrapper]")
    console.log(notesWrapper)
    const notes = JSON.parse(localStorage.getItem("notes"))
    notes.forEach(note => {
        console.log(note)
        notesWrapper.append(note)
    })

}

// this might become a problem when you will need more than 1 date
const date = today()
console.log(date)

// add created at, modfied at and pinned 

export function setNote(title, content, bgColor) {

    if (localStorage.getItem("notes")) {

        const notes = JSON.parse(localStorage.getItem("notes"))
        const note = {
            id: notes.length ? notes[notes.length - 1].id + 1 : 1,
            title: title,
            content: content,
            bgColor: bgColor,
            date: date
        }

        notes.push(note)

        localStorage.getItem("notes", JSON.stringify(notes))

    } else {
        localStorage.setItem('notes', "[]")
        setNote(title, content, bgColor)
    }
}


const noteModal = document.querySelector("[data-note-editor]")
const createNoteBtn = document.querySelector("[data-create-note-btn]")
createNoteBtn.addEventListener('click', () => {
    noteModal.showModal()
})

export function noteEditor() {

}
