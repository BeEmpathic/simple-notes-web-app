import { getFormattedDate } from "../modules/dateFormatter.js"




export function renderNotes() {
    const notesWrapper = document.querySelector("[data-notes-wrapper]")
    console.log(notesWrapper)
    const notes = JSON.parse(localStorage.getItem("notes"))
    notes.forEach(note => {
        console.log(note)
        notesWrapper.append(note)
    })

}




export function setNote(title, content, bgColor) {

    if (localStorage.getItem("notes")) {
        const formattedDate = getFormattedDate()
        const notes = JSON.parse(localStorage.getItem("notes"))
        const note = {
            id: notes.length ? notes[notes.length - 1].id + 1 : 1,
            title: title,
            content: content,
            bgColor: bgColor,
            date: formattedDate
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
