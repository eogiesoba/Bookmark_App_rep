$(document).ready(function () {

    var UserID 
    function loadBookmarksIndex() {
        $.ajax({
            method: "GET",
            url: "/api/bookmarks",
        }).then(function (data) {
            console.log(data)
            console.log("done!");
            UserID = data[0].UserId;

            createBookmarkDiv(data);
        });
    };

    function createBookmarkDiv(bookmarkData) {

        console.log(bookmarkData);
        for (var j = 0; j < bookmarkData.length; j++) {
            var bigBMDiv = $("<div>");
            // bigBMDiv.data("bookmark", bookmarkData);
            bigBMDiv.addClass("col-md-3");
            bigBMDiv.addClass("bmBox");

            var titleDiv = $("<div>");
            titleDiv.addClass("bmTitleDiv");
            var bmTitle = bookmarkData[j].title;
            console.log("This is title: ", bmTitle);
            titleDiv.append(bmTitle);
            bigBMDiv.append(titleDiv);

            // var folderDiv = $("div");
            // folderDiv.addClass("bmFolderDiv");
            // bigBMDiv.append(folderDiv);


            bigBMDiv.attr("href", bookmarkData[j].url);
            bigBMDiv.on("click", function () {
                window.open($(this).attr("href"), '_blank');
            });
            $("#bookmarksDisplay").append(bigBMDiv);
        }
    };

    loadBookmarksIndex();
    getFolders();

    document.getElementById('folderSubmitBtn').addEventListener('click', function () {
        console.log("folderButton pressed");
        var newFolder = document.getElementById("addFolder").value;
        console.log("newfoldername", newFolder);
        console.log("userID", UserID);
        var folderObj = {
            folder: newFolder,
            userID: UserID
        }
        console.log(folderObj);
        postFolders(folderObj);

    });

    function postFolders(Folder) {
        console.log("in postfolder:", Folder);
        $.ajax({
            method: "POST",
            url: "/api/folders",
            data: Folder
        }).then(function (data) {
            console.log("Your folder has been made.");
            // console.log(data);
        });

        loadFolderRows(Folder);
    };

    function getFolders() {
        $.ajax({
            method: "GET",
            url: "/api/folders",
        }).then(function (data) {
            console.log(data)
            console.log("done!");
            UserID = data[0].UserId;

            createFolderRows(data);
        });
    };

    function createFolderRows(folderData){
        for(var i=0; i<folderData.length; i++){
            var folderLine = $("<li>");
            // folderLine.data("folder", folderData);
            console.log(folderData[i].folder);
            folderLine.append("<li>" + folderData[i].folder + "</li>");
            $("#sidebar").append(folderLine);
        }
        
    };

    function loadFolderRows(folderData){
        var folderLine = $("<li>");
        console.log(folderData.folder);
        folderLine.append("<li>" + folderData.folder + "</li>");
        $("#sidebar").append(folderLine);
    };
});