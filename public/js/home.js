$(document).ready(function () {


    console.log(userObj);

    var UserID;
    var userID;
    var email;
    var folderDetails = [];
    // console.log(userObj); 
    var dragSrcEl = null;


    document.drag = function(ev) {
        var target = ev.target;
        var dataArr = [];
        var x = target.getAttribute("folderName");
        dataArr.push(x);
        var y = target.getAttribute("folderID");
        dataArr.push(y);
        console.log("dataArr", dataArr);
        dataArr= JSON.stringify(dataArr);
        console.log("stringDA", dataArr);
        ev.dataTransfer.setData("text", dataArr);
        ev.dataTransfer.effectAllowed = "copy";
        console.log("dragging", x, y);

    }

    document.allowDrop = function(ev){
        ev.preventDefault();
        console.log("allowDrop");
    }

    document.drop = function(ev) {
        ev.preventDefault();
        dataArr = [];
        var target = ev.target;
        ev.dataTransfer.dropEffect = "copy";
        var data = ev.dataTransfer.getData("text");
        console.log("dropping", data);
        dataArr = JSON.parse(data);
        console.log("parsed", dataArr);
        $(target).attr("folderName", dataArr[0]);
        $(target).attr("folderID", dataArr[1]);
        $(target).append("<div class='folderNameDiv'>" + dataArr[0] + "</div>");
    }


    document.getElementById('returnUserButton').addEventListener('click', function () {

        console.log("Works!");
        email = document.getElementById("userName").value;
        console.log(email);
        renderBookmarks();

    });
    function renderBookmarks() {//Looks for userID associated with email
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/api/users",
        }).then(function (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                var userEmail = data[i].user;
                if (userEmail === email) {
                    userID = data[i].id
                }
            }
            console.log(userID);
            loadBookmarksIndex(userID);
        });
    }

    function loadBookmarksIndex(id) {//Renders bookmarks for userID associated with email
        $.ajax({
            method: "GET",
            url: "/api/bookmarks/" + id,
        }).then(function (data) {
            console.log(data)
            console.log("done!");
            UserID = data[0].UserId;

            createBookmarkDiv(data);

        });
    };

    function createBookmarkDiv(bookmarkData) {
        
        console.log("bookData", bookmarkData);
        for (var j = 0; j < bookmarkData.length; j++) {
            var bigBMDiv = $("<div>");
            bigBMDiv.addClass("col-md-2");
            bigBMDiv.addClass("bmBox");
            bigBMDiv.attr("ondragover", "allowDrop(event)");
            bigBMDiv.attr("ondrop", "drop(event)");

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
            folderDiv.append("<p>" + 'Assign a Folder' + "</p");
            bigBMDiv.append(folderDiv);

            $("#bookmarksDisplay").append(bigBMDiv);  
         }

        $("#bookmarksDisplay").append(bigBMDiv);   

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

    function createFolderRows(folderData){
        for(var i=0; i<folderData.length; i++) {
            var folderLine = $("<div>");
            folderLine.addClass("row");
            folderLine.addClass("folderList");
            console.log(folderData[i].folder);

            var folderLabelDiv = $("<div>");
            folderLabelDiv.addClass("col-sm-8");
            folderLabelDiv.addClass("folderLabelDiv");
            folderLabelDiv.attr("userID", folderData[i].UserId);
            folderLabelDiv.attr("folderName", folderData[i].folder);
            folderLabelDiv.attr("folderID", folderData[i].id);
            console.log("folderLabelInfo", folderData[i].UserId, folderData[i].folder, folderData[i].id );
            folderLabelDiv.attr("draggable", true);
            folderLabelDiv.attr("ondragstart", "drag(event)");
            folderLabelDiv.append("<p class='folderLabelDivText'>" + folderData[i].folder + "</p>");
            folderLine.append(folderLabelDiv);
            
            var searchIconDiv = $("<div>");
            searchIconDiv.addClass("col-sm-4")
            searchIconDiv.addClass("searchIcon");
            searchIconDiv.attr("folderId", folderData[i].id);
            searchIconDiv.append("<i class='fas fa-search' id='folderSort'></i>");
            folderLine.append(searchIconDiv);
            
            
            $("#sidebar").append(folderLine);
        }
    };

    function loadFolderRows(folderData) {
        var folderLine = $("<div>");
        folderLine.addClass("folderList");
        console.log(folderData.folder);
        folderLine.append("<div>" + folderData.folder + "</div>");
        $("#sidebar").append(folderLine);
    };


});
