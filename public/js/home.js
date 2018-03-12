

$(document).ready(function () {

    renderBookmarks();//This our bookmark render function that runs when page is loaded. 
    renderFolders();//This is our folder render function that runs when page is loaded.

    // console.log(userObj);
    document.getElementById("userName").value = localStorage.getItem("BookmarkUserEmail");
    //Global variables
    var userID;//This is being used in a get request
    var email;
    var folderDetails = [];
    // console.log(userObj); 
    var dragSrcEl = null;


    document.drag = function (ev) {
        var x = ev.target.getAttribute("folderID");
        ev.dataTransfer.setData("text", x);
        console.log("dragging", x);
    }

    document.allowDrop = function (ev) {
        ev.preventDefault();
        console.log("allowDrop");
    }

    document.drop = function (ev) {
        ev.preventDefault();
        var folderID = ev.dataTransfer.getData("text");
        var bookmarkID = ev.target.id;
        console.log("dropped this folderID", folderID);
        console.log("in bookmarkID", bookmarkID);
        var bookmarkData = {
            id: bookmarkID,
            FolderId: folderID
        }
        updateBookmarks(bookmarkData);//PUT REQUEST
    }

    function updateBookmarks(info) {
        $.ajax({
            method: "PUT",
            url: "http://localhost:8080/api/bookmarks",
            data: info
        }).then(function (data) {
            console.log("Your bookmark has been updated!");
            renderBookmarks();
        });
    };

    document.getElementById('returnUserButton').addEventListener('click', function () {
        console.log("Works!");
        clearDiv();
        email = document.getElementById("userName").value;
        localStorage.setItem("BookmarkUserEmail", email);
        console.log(email);
        renderBookmarks();
        renderFolders();
        var x = document.querySelectorAll("#bookmarksDisplay")[0];
        console.log(x);

    });

    function renderBookmarks() {
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/api/users",
        }).then(function (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {//Looks for userID associated with email
                var userEmail = data[i].user;
                if (userEmail === email) {
                    userID = data[i].id;
                    getBNF_Tables(userID);
                    break;//This will end the loop when a userID match is found!
                }
            }
            console.log(userID);
        });
    }


    function getBNF_Tables(id) {//Renders bookmark and folder info for userID associated with email
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/api/bookmarks/" + id,
        }).then(function (b_Data) {
            console.log(b_Data)
            console.log("done!");
            userID = b_Data[0].UserId;
            console.log(userID);
            $.ajax({
                method: "GET",
                url: "http://localhost:8080/api/folders/" + id,
            }).then(function (f_Data) {
                createBookmarkDiv(b_Data, f_Data);
            });
        });       
    };

    function createBookmarkDiv(bookmarkData, folderData) {
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

            btnDiv.append("<a href='" + bookmarkData[j].url + "' target='_blank'><button type='button' class='btn btn-sm urlBtn'>Click to Page</button></a>");
            btnDiv.append("<button id='garbageBtn'><i class='fas fa-trash-alt'></i></button>");
            bigBMDiv.append(btnDiv);

            var folderDiv = $("<div>");
            folderDiv.addClass("bmFolderDiv");
            folderDiv.attr("id", bookmarkData[j].id);
            folderDiv.attr("ondragover", "allowDrop(event)");
            folderDiv.attr("ondrop", "drop(event)");

            //---------------------------------------------Get folder names for each bookmark
            // if (bookmarkData[j].FolderId !== null) {
            //     var Fid = { 
            //         id: bookmarkData[j].FolderId
            //     };
            //     var BFN = getFolderName(Fid);
            //     folderDiv.append("<div id='folderNameDiv'>" + BFN + "</div>")
            // } else {
            //     folderDiv.append("<div id='folderNameDiv'>" + 'Assign a Folder' + "</div");
            // }
            //------------------------------------------------------------------------------
            bigBMDiv.append(folderDiv);
            $("#bookmarksDisplay").append(bigBMDiv);
        }
    }

    document.getElementById('folderSubmitBtn').addEventListener('click', function () {
        console.log("folderButton pressed");
        var newFolder = document.getElementById("addFolder").value;
        console.log("newFolderName", newFolder);
        console.log("userID", userID);
        var folderObj = {
            folder: newFolder,
            userID: userID
        }
        console.log(folderObj);
        postFolders(folderObj);

    });

    function postFolders(Folder) {
        console.log("in postFolder:", Folder);
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/api/folders",
            data: Folder
        }).then(function (data) {
            renderFolders();
        });
    };

    function renderFolders() {
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/api/folders",
        }).then(function (data) {
            $("#folderTable").empty();
            console.log(data)
            console.log("got arrays!");
            for (var i = 0; i < data.length; i++) {
                var folderUserID = data[i].UserId;
                console.log("this is folderUserID: ", folderUserID);
                console.log("this is UserID: ", userID);
                console.log("Folder Name: ", data[i].folder);
                var foldername = data[i];

                if (folderUserID === userID) {
                    createFolderRows(foldername);
                }
            }
        });
    };

    function createFolderRows(folderData) {
        console.log(folderData);
        console.log("matching folder!")
        var folderLine = $("<div>");
        folderLine.addClass("row");
        folderLine.addClass("folderList");

        var folderLabelDiv = $("<div>");
        folderLabelDiv.addClass("col-sm-8");
        folderLabelDiv.addClass("folderLabelDiv");
        folderLabelDiv.attr("userID", folderData.UserId);
        folderLabelDiv.attr("folderName", folderData.folder);
        folderLabelDiv.attr("folderID", folderData.id);
        folderLabelDiv.attr("draggable", true);
        folderLabelDiv.attr("ondragstart", "drag(event)");

        folderLabelDiv.append("<p class='folderLabelDivText'>" + folderData.folder + "</p>");
        folderLine.append(folderLabelDiv);

        var searchIconDiv = $("<div>");
        searchIconDiv.addClass("col-sm-4")
        searchIconDiv.addClass("searchIcon");
        searchIconDiv.attr("folderId", folderData.id);
        searchIconDiv.append("<button id='folderSort'><i class='fas fa-search'></i></button>");
        folderLine.append(searchIconDiv);
        $("#folderTable").append(folderLine);
    };

    function clearDiv() {
        $(".bmBox").remove();
        $(".folderList").remove();
    }

});
