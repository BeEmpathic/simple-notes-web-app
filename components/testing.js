const notesTemplate = document.querySelector("[data-note-template]")


export function displayNotes() {
    const notesWrapper = document.querySelector("[data-notes-wrapper]")
    const notes = JSON.parse(localStorage.getItem("notes"))
    notesWrapper.innerHTML = ""

    if (notes) {
        notes.forEach((note) => {
            const template = notesTemplate.content.cloneNode(true)
            const createdAt = note.date
            const formatter = new Intl.DateTimeFormat("PL", {
                dateStyle: "short"
            })

            template.querySelector("[data-note-title]").textContent = note.title
            template.querySelector("[data-note-content]").textContent = note.content
            template.querySelector("[data-note-date]").textContent = formatter.format(note.date)
            template.addEventListener("click", editNote(note.id))

            notesWrapper.append(template)
        })

    }

}
export function saveNote(id = self.crypto.randomUUID(), title, content = "") {
    const now = new Date()
    const createdAt = now
    const modifiedAt = now

    const note = {
        id: id,
        title: title,
        content: content,
        bgColor: "white",
        createdAt: createdAt,
        modifiedAt: modifiedAt,
        pinned: false
    }

    const notes = JSON.parse(localStorage.getItem("notes")) || []
    notes.push(note)
    localStorage.setItem("notes", JSON.stringify(notes))
}


const noteEditor = document.querySelector("[data-note-editor]")
const noteEditorTitle = noteEditor.querySelector("[data-note-editor-title]")
const noteEditorContent = noteEditor.querySelector("[data-note-editor-content]")

const createNoteBtn = document.querySelector("[data-create-note-btn]")
export function editNote(id) {
    noteEditorTitle.innerHTML = ""
    noteEditorContent.innerHTML = ""
    if (id) {
        let notes = JSON.parse(localStorage.getItem("notes"));
        let note = notes.find(n => n.id === id);

        noteEditorTitle.textContent = note.title
        noteEditorContent.textContent = note.content

        noteEditor.style.backgroundColor = note.bgColor

        // check if the removing works correctly
        noteEditor.removeEventListener("close", saveNote)
        // this I think will get the needed stuff udpated by user
        noteEditor.addEventListener("close", saveNote(id, noteEditorTitle.textContent, noteEditorContent.textContent))


    } else {
        if (noteEditorTitle.textContent) {
            noteEditor.removeEventListener("close", saveNote)
            noteEditor.addEventListener("close", saveNote(noteEditorTitle.textContent, noteEditorContent.textContent))
        }
    }


    noteEditor.showModal()
}

export function deleteNote(id) {

}

export function changeNoteBackgroundColor(id) {

}

export function pinNote(id) {

}

