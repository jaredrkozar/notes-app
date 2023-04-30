let noNoteView = document.getElementsByClassName("noNoteSelected")[0]
let noteTextView = document.getElementsByClassName("textFields")[0]

let titleTextView = document.getElementById("notetitlefield")
let bodyTextView = document.getElementById("notetextfield")

async function getNotes() {
    const arrayStrings = window.location.href.split("/");

    $.get("/" + arrayStrings[3] + '/fetchNotes', function(data){
        console.log(data);
    })
}

function newNote() {
    noteTextView.style.display = "flex"
    noNoteView.style.display = "none"
}

window.onload = async () => {
    noNoteView.style.display = "block"
    noteTextView.style.display = "none"
    await getNotes();
};

function saveNote() {
    const arrayStrings = window.location.href.split("/");
    $.post("/saveNote", {body: {title: titleTextView.value, text: bodyTextView.value, userid: arrayStrings[3], noteid: arrayStrings[5] ?? undefined}})
}