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
// not working
    $(document).on("click", ".delete-btn", function() {
        event.preventDefault();
        const id = $(this).attr("data");
        console.log(id)
        $.ajax({
            method: "PUT",
            url: "/delete/" + id
        }).done(function() {
            location.reload();
        })
    });

// definately not working 
    $(document).on("click", ".note-btn", function(){
        let id = $(this).attr("data");
        console.log("I hit the note button")
        $("#save-note").attr("data-id", id);
        $ajax({
            url: "/articles/" + id,
            type: "GET"
        }).then(function(re) {
            console.log(res);
            $("#note-input").text(res.note.body);
            M.updateTextFiled();
        })
    })

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
   
   




    


    // // $('.btn-deletenote').click(function (event) {})
    // $(document).on('click', '.btn-deletenote', function (){
    //         event.preventDefault();
    //         console.log($(this).attr("data"))
    //         const id = $(this).attr("data");
    //         console.log(id);
    //         $.ajax(`/note/${id}`, {
    //             type: "DELETE"
    //         }).then(function () {
    //             $('#note-modal').modal('toggle');
    //         });
    // });

//     $("#save-note").click(function (event) {
//         event.preventDefault();
//         const id = $(this).attr('data');
//         const noteText = $('#note-input').val().trim();
//         $('#note-input').val('');
//         $.ajax(`/note/${id}`, {
//             type: "POST",
//             data: { text: noteText}
//         }).then(function (data) {
//             console.log(data)
//         })
//         $('#note-modal').modal('toggle');
//     });


    
})
