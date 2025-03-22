const notesTemplate = document.querySelector("[data-note-template]")


export function displayNotes() {
    const notesWrapper = document.querySelector("[data-notes-wrapper]")
    let notes = JSON.parse(localStorage.getItem("notes"))
    notesWrapper.innerHTML = ""

    if (notes) {

        notes.forEach((note) => {

            const template = notesTemplate.content.cloneNode(true)
            const createdAt = new Date(note.createdAt)
            const formatter = new Intl.DateTimeFormat("PL", {
                dateStyle: "short"
            })

            template.querySelector("[data-note-title]").textContent = note.title
            template.querySelector("[data-note-content]").innerHTML = note.content
            template.querySelector("[data-note-date]").textContent = formatter.format(createdAt)
            console.log(template)
            template.querySelector("[data-note]").addEventListener("click", () => {
                console.log("Note id:", note.id)
                editNote(note.id)
            }
            )

            notesWrapper.append(template)
        })

    }

}

export function saveNote(title, content = "", id = self.crypto.randomUUID()) {
    const now = new Date()

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    console.log("Save notes was invoked")
    let noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].title = title;
        notes[noteIndex].content = content;
        notes[noteIndex].modifiedAt = now;
    } else {
        const note = {
            id,
            title,
            content,
            bgColor: "white",
            createdAt: now,
            modifiedAt: now,
            pinned: false
        }
        notes.push(note)
    }

    localStorage.setItem("notes", JSON.stringify(notes))
    displayNotes()
}


const noteEditor = document.querySelector("[data-note-editor]")
const noteEditorTitle = noteEditor.querySelector("[data-note-editor-title]")
const noteEditorContent = noteEditor.querySelector("[data-note-editor-content]")

let currentNoteId

const createNoteBtn = document.querySelector("[data-create-note-btn]")
export function editNote(id) {
    console.log("EditNote was invoken")
    let notes = JSON.parse(localStorage.getItem("notes"))
    noteEditorTitle.innerHTML = ""
    noteEditorContent.innerHTML = ""
    if (id) {
        currentNoteId = id
        let note = notes.find(n => n.id === id);

        noteEditorTitle.textContent = note.title
        noteEditorContent.innerHTML = note.content

        noteEditor.style.backgroundColor = note.bgColor

    } else {
        currentNoteId = undefined
    }
    noteEditor.showModal()
}






export function deleteNote(id) {

}

export function changeNoteBackgroundColor(id) {

}

export function pinNote(id) {

}



function handleEditorClose() {
    if (noteEditorTitle.textContent || noteEditorContent.textContent)
        saveNote(noteEditorTitle.textContent, noteEditorContent.innerHTML, currentNoteId)
}

noteEditor.addEventListener("close", handleEditorClose)