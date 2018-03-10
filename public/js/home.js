$(document).ready(function () {

    // console.log(userObj);
    var UserID;
    var folderDetails = [];


    function loadBookmarksIndex() {
        $.ajax({
            method: "GET",
            url: "/api/bookmarks",
            // data: userObj
        }).then(function (data) {
            console.log(data)
            console.log("done!");
            UserID = data[0].UserId;

            createBookmarkDiv(data);
        });
    };

    function createBookmarkDiv(bookmarkData) {
        
        console.log("folderData in bkrender", folderDetails);
        console.log("bookData", bookmarkData);
        for (var j = 0; j < bookmarkData.length; j++) {
            var bigBMDiv = $("<div>");
            bigBMDiv.addClass("col-md-2");
            bigBMDiv.addClass("bmBox");

            var titleDiv = $("<div>");
            titleDiv.addClass("bmTitleDiv");
            var bmTitle = bookmarkData[j].title;
            console.log("This is title: ", bmTitle);
            titleDiv.append(bmTitle);
            bigBMDiv.append(titleDiv);
            
            var btnDiv = $("<div>");
            btnDiv.attr("delete");
            btnDiv.addClass("btnStyle");
            
            btnDiv.append("<a href='" + bookmarkData[j].url + "' target='_blank'><button type='button' class='btn btn-sm urlBtn'>'Click to URL'</button></a>");
            btnDiv.append("<i class='fas fa-trash-alt garbageBtn'></i>");
            bigBMDiv.append(btnDiv);

            var folderDiv = $("<div>");
            folderDiv.addClass("bmFolderDiv");
            folderDiv.addClass("form-group");
            folderDiv.append("<p>" + 'Assign a Folder' + "</p");
            bigBMDiv.append(folderDiv);

            $("#bookmarksDisplay").append(bigBMDiv);  
         }
            // bigBMDiv.attr("href", bookmarkData[j].url);
            // bigBMDiv.on("click", function () {
            //     window.open($(this).attr("href"), '_blank');
        $("#bookmarksDisplay").append(bigBMDiv);   // });

        }

   
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
            console.log("got arrays!");
            UserID = data[0].UserId;
            createFolderRows(data);
 
        });
    };
    
    console.log("dets out", folderDetails);

    function createFolderRows(folderData){
        for(var i=0; i<folderData.length; i++){
            var folderLine = $("<li>");
            folderLine.addClass("folderList");
            folderLine.attr("userID", folderData[i].UserId);
            folderLine.attr("folderName", folderData[i].folder);
            // folderLine.data("folder", folderData);
            console.log(folderData[i].folder);
            folderLine.append("<li>" + folderData[i].folder + "</li>");
            $("#sidebar").append(folderLine);
        }
    };

    function loadFolderRows(folderData){
        var folderLine = $("<div>");
        folderLine.addClass("folderList");
        console.log(folderData.folder);
        folderLine.append("<div>" + folderData.folder + "</div>");
        $("#sidebar").append(folderLine);
    };
});
