$(document).ready(function(){

    $(document).on("click", ".save-btn", function(){
        let id = $(this).attr("data-id");
        console.log(id);
        $.ajax({
            url: "/saved/" + id,
            type: "PUT",
            data: id,
        }).then(function(res){
            if(res){
                $("#" + id).remove();
            }
        })
    })

    $(document).on("click", ".delete-btn", function(){
        let id = $(this).attr("data-id");
        console.log(id);
        $.ajax({
            url: "/removed/" + id,
            type: "PUT",
            data: id,
        }).then(function(res) {
            if(res){
                $("#" + id).remove();
            }
        })
    });

    $(document).on("click", ".scrape-new", function(){
        $.ajax({
            url: "/scrape/",
        }).then(function(res){
            location.reload();
        })
    });

    $(document).on("click", ".note-btn", function(){
        let id = $(this).attr("data-id");
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

    $(document).on("click", "#save-note", function(){
        let id = $(this).attr("data-id");
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

    let modal = document.querySelector(".modal");
    M.Modal.init(modal,{
        onCloseEnd: function(){
            $("#note-input");
        }
    })
})