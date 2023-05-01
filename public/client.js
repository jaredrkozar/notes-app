let noNoteView = document.getElementsByClassName("noNoteSelected")[0]
let noteTextView = document.getElementsByClassName("textFields")[0]
let notesTableView = document.getElementsByClassName("notesTable")[0]

let usernameTextField = document.getElementById("usernameField")
let passwordTextField = document.getElementById("passwordField")

let titleTextView = document.getElementById("notetitlefield")
let bodyTextView = document.getElementById("notetextfield")

let currentNoteID = undefined

const noNotes = () => {
    let noNotesMessage = document.createElement("div");
    noNotesMessage.classList.add('noNotesMessage')
    let noNotesTitle = document.createElement("h2");
    noNotesTitle.classList.add('noNotesTitle')
    noNotesTitle.innerHTML = `<h2>You have no notes</h2>`;
    let noNotesText = document.createElement("h3");
    noNotesText.classList.add('noNotesText')
    noNotesText.innerHTML = `<h2>Create a note by tapping on the plus button on the upper right</h2>`;
    noNotesMessage.appendChild(noNotesTitle)
    noNotesMessage.appendChild(noNotesText)
    notesTableView.appendChild(noNotesMessage)
};

async function getNotes() {
    const arrayStrings = window.location.href.split("/");
    while (notesTableView.hasChildNodes()) {
        notesTableView.removeChild(notesTableView.firstChild)
    }

    $.get("/" + arrayStrings[3] + '/fetchNotes', function(data){
        if (data.length == 0) {
            noNotes.style.diplay = "block"
        } else {
            for(let i = 0; i<data.length;i++) {
                let currentNote = document.createElement("div");
                currentNote.classList.add('noteCell')
                let noteTitle = document.createElement('h2')
                noteTitle.classList.add('noteTitle')
                noteTitle.innerHTML = `<h2>${data[i].title}</h2>`;
                let noteText = document.createElement('h2')
                noteText.classList.add('noteText')
                noteText.innerHTML = `<h2>${data[i].noteText}</h2>`;
                currentNote.appendChild(noteTitle)
                currentNote.appendChild(noteText)
                notesTableView.appendChild(currentNote)
                currentNote.addEventListener("click", function() {
                    let selectedNote = document.getElementsByClassName("selectedNote")
                    if (selectedNote.length > 0) {
                        selectedNote[0].classList.remove('selectedNote')
                    }

                    selectNote(data[i].title, data[i].noteText, data[i].note_id)
                    currentNote.classList.add('selectedNote')
                })
            }
        }
    })
}

function newNote() {
    currentNoteID = undefined
    document.getElementById("deleteNoteButton").style.display = "none"
    noteTextView.style.display = "flex"
    noNoteView.style.display = "none"
    titleTextView.value = ""
    bodyTextView.value = ""
}

window.onload = async () => {
    noNoteView.style.display = "block"
    noteTextView.style.display = "none"
    await getNotes();
};

async function saveNote() {
    const arrayStrings = window.location.href.split("/");
    $.post("/saveNote", {body: {title: titleTextView.value, text: bodyTextView.value, userid: arrayStrings[3], noteid: currentNoteID ?? undefined}})
    await getNotes();
}

async function deleteNote() {
    const arrayStrings = window.location.href.split("/");
    $.post("/deleteNote", {body: {userid: arrayStrings[3], noteid: currentNoteID ?? undefined}});

    noNoteView.style.display = "block"
    noteTextView.style.display = "none"

    await getNotes();
}

function selectNote(noteTitle, noteText, noteID) {
    currentNoteID = noteID
    noteTextView.style.display = "flex"
    noNoteView.style.display = "none"
    document.getElementById("deleteNoteButton").style.display = "block"

    titleTextView.value = noteTitle
    bodyTextView.value = noteText
}