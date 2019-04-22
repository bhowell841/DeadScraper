$(document).ready(function(){

// Good but needs refining
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

// definately not working 
    // $(document).on("click", ".note-btn", function(){
    //     let id = $(this).attr("data");
    //     console.log("I hit the note button: " + data)
    //     $('#article-id').text(id);
    //     $('#save-note').attr('data', id);
    //     $.ajax(`/articles/${id}`, {
    //         type: "GET"
    //     }).then(function (data) {
    //         console.log(data)
    //         $('.articles-available').empty();
    //     $('#note-modal').modal('toggle');
    // });

// I can't get the modal to even fucking pop
    $(document).on("click", "#save-note", function(){
        let id = $(this).attr("id");
        $.ajax({
            url: "/articles/" + id,
            type: "POST",
            data: {
                body: $("#note-input")
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
