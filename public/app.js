$(document).ready(function(){

// Good but needs refining, but I don't have time for that
    $(document).on('click', '#clear-articles', function() {
        $.ajax({
            url: "/articles",
            type: "DELETE"
        }).then(function(res) {
            location.reload();
        })
    });
// Good
    $(document).on("click", "#scrape-articles", function(){
        $.ajax({
            url: "/scrape",
            type: "GET"
        }).then(function(res) {
            location.reload();
        })
    });
// working motherfucker, it fucking works.  Finally.
    $(document).on("click", ".delete-btn", function() {
        event.preventDefault();
        const id = $(this).attr("data");
        console.log(id)
        $.ajax(`/remove/${id}`, {
            type: "PUT",
            
        }).then(function() {
            location.reload();
        })
    });

// Courtesy of Tom McCarthy my awesome tutor
    function noteFormMaker(text, id){
        var container = $("<div>")
        var noteInput = $("<textarea>").attr("id", "noteInput")
        noteInput.val(text)
        var saveButton = $("<button>").attr("articleID", id).attr("id", "save-note").text("Save")
        container.append(noteInput, saveButton)
        $("#note-form").append(container)
}
// Courtesy of Tom McCarthey my awesome tutor    
    $(document).on("click", ".note-btn", function(){
        $("#note-form").empty()
        let id = $(this).attr("data");
        console.log("I hit the note button: " + id)
        $.ajax({
            url: "articles/" + id,
            type: "GET"
        }).then(function(data){
            console.log("article from backend", data)
            if (data.note.length > 0){
                noteFormMaker(data.note[0].body, id)
            }else{
                noteFormMaker("", id)
            }
        })
    });

// Courtesy of Tom McCarthey my awesome tutor
    $(document).on("click", "#save-note", function(){
        console.log("save note clicked")
        let id = $(this).attr("articleID");
        
        $.ajax({
            url: "/note/" + id,
            type: "POST",
            data: {
            body: $("#noteInput").val()
            }
            }).then(function(res){
                console.log(res) 
        })
    })

// DONT FUCKING TOUCH -------------------------
    $(document).on("click", ".save-btn", function() {
        event.preventDefault();
        const button = $(this);
        const id = button.attr("id");
        $.ajax(`/save/${id}`, {
            type: "PUT"
        }).then(function() {
            button.text("Article Saved");
        })
    })
// -----------------------------------------------
     
})
