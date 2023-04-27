let noNoteView = document.getElementsByClassName("noNoteSelected")[0]
let noteTextView = document.getElementsByClassName("noteFields")[0]

function getNotes() {
    const arrayStrings = window.location.href.split("/");
    console.log(arrayStrings[3])
}

function newNote() {
    noNoteView.style.display = "none"
    noteTextView.style.display = "block"
}

window.onload = () => {
    noNoteView.style.display = "block"
    noteTextView.style.display = "none"
    getNotes();
};