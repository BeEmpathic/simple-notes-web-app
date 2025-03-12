import { getFormattedDate } from "./modules/dateFormatter.js"
export function Note(title, content, bgColor) {


    return (`
    <div class="note" styte="background-color: ${bgColor}">
        <div class="note-title">${title}</div>
        <div class="note-content">${content}</div>
        <button>Color</button>
        <button>Delete</button>
    </div>
    `)
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


        localStorage.setItem("notes", JSON.stringify(notes))

    } else {
        localStorage.setItem('notes', "[]")
        setNote(title, content, color)
    }
}

