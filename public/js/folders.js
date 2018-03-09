$(document).ready(function () {

var newFolder = $("#addFolder");
var userId = 


getFolders();

var newFolderSubmit = function(event) {
    event.preventDefault();
    if (!newFolder.val().trim().trim()) {
      return;
    }

    var folderNew({
      folder: newFolder
        .val()
        .trim(),
        userID
    })
  
postFolders(folderNew);
}

var postFolders = function(data){
    $.ajax({
        method : "POST",
        url: "https://localhost:8080/api/folders",
        data: data
    }).then(function(getFolders){
           
    });
}

var createFolderRow = function(folderData){
    var newLine = $("<li>");
    newLine.data("folder", folderData);
    newLine.append("<li>" + folderData.type + "<a class='delete-folder'><span class='oi oi-trash'></span></a></li>");
    return newLine;
}

var getFolders = function(User) {
    userID = user
        $.ajax({
            method : "GET",
            url: "http://localhost:8080/api/folders",
            data: User
        }).then(function(){
            console.log("done!");
        });
    }

}






});