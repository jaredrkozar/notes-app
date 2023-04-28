let noNoteView = document.getElementsByClassName("noNoteSelected")[0]
let noteTextView = document.getElementsByClassName("noteFields")[0]
let saveNoteButton = document.getElementById("saveNoteButton")

function getNotes() {
    const arrayStrings = window.location.href.split("/");
    console.log(arrayStrings[3])
}

function newNote() {
    noteTextView.style.display = "block"
    noNoteView.style.display = "none"
    saveNoteButton.style.display = "block"
}

window.onload = () => {
    noNoteView.style.display = "block"
    noteTextView.style.display = "none"
    saveNoteButton.style.display = "none"
    getNotes();
};