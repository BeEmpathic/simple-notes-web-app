// export default function renderNotes() {
//     const notedata = {
//         id: id,
//         title: title,
//         content: content,
//         bgColor: bgColor,
//         path: path
//     }

//     const note = `
//     <div class="note" styte="background-color: ${bgColor}">
//         <div class="note-title">${title}</div>
//         <div class="note-content">${content}</div>
//         <button>Color</button>
//         <button>Delete</button>
//     </div>
//     `

//     const notesWrapper = document.querySelector("[data-notes]")
//     const notes = localStorage.Notes


// }

export default function setNotes(title, content, color) {


    if (localStorage.getItem("notes")) {
        const notes = JSON.parse(localStorage.getItem("notes"))
        const note = {
            id: notes.length ? notes[notes[notes.length - 1].id] - 1 : 1,
            title: title,
            content: content,
            color: color
        }

        console.log(notes)
        notes.push(note)
        console.log(notes)

        localStorage.setItem("notes", JSON.stringify(notes))

    } else {
        localStorage.setItem('notes', "[]")
        setNotes(title, content, color)
    }
}
