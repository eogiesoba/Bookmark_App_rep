

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

    document.querySelector("#bookmarksDisplay").addEventListener('click', function(ev){
        console.log("garbageClicked");
        console.log("event", ev.target);
        console.log("ev", ev.target.getAttribute("id"));
        var id = ev.target.getAttribute('id');
        console.log("id", id);
        deleteBookmark(id);
        renderBookmark();

    })


    function updateBookmarks(info) {
        $.ajax({
            method: "PUT",
            url: "https://chrome-bookmark-app.herokuapp.com/api/bookmarks",
            data: info
        }).then(function (data) {
            console.log("Your bookmark has been updated!");
            clearDiv();
            renderBookmarks();
            renderFolders();
        });
    };

    function renderBookmarks() {
        $.ajax({
            method: "GET",
            url: "https://chrome-bookmark-app.herokuapp.com/api/users",
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
            url: "https://chrome-bookmark-app.herokuapp.com/api/bookmarks/" + id,
        }).then(function (b_Data) {
            console.log(b_Data)
            console.log("done!");
            userID = b_Data[0].UserId;
            console.log(userID);
            $.ajax({
                method: "GET",
                url: "https://chrome-bookmark-app.herokuapp.com/api/folders/" + id,
            }).then(function (f_Data) {
                createBookmarkDiv(b_Data, f_Data);
            });
        });
    };

    function createBookmarkDiv(bookmarkData, folderData) {
        var bookFID;
        var tableFID;
        var BFN;

        console.log("bookData", bookmarkData);
        for (var j = 0; j < bookmarkData.length; j++) {
            var bigBMDiv = $("<div>");
            bigBMDiv.addClass("col-md-2");
            bigBMDiv.addClass("bmBox");
            bigBMDiv.attr("draggable", true);
            bigBMDiv.attr("ondragstart", "drag(event)");
            var titleDiv = $("<div>");
            titleDiv.addClass("bmTitleDiv");
            var bmTitle = bookmarkData[j].title;
            console.log("This is title: ", bmTitle);
            titleDiv.append(bmTitle);
            bigBMDiv.append(titleDiv);
            
            var btnDiv = $("<div>");
            btnDiv.attr("delete");
            btnDiv.addClass("btnStyle");

            btnDiv.append("<a href='" + bookmarkData[j].url + "' target='_blank'><button type='button' class='btn btn-sm urlBtn'>Click to Page</button></a></div>");

            bigBMDiv.append(btnDiv);

            var folderDiv = $("<div>");
            folderDiv.addClass("bmFolderDiv");
            folderDiv.attr("id", bookmarkData[j].id);
            folderDiv.attr("ondragover", "allowDrop(event)");
            folderDiv.attr("ondrop", "drop(event)");

            //---------------------------------------------Get folder names for each bookmark
            if (bookmarkData[j].FolderId !== null) {
                bookFID = bookmarkData[j].FolderId;
                for (var i = 0; i < folderData.length; i++) {
                    tableFID = folderData[i].id;
                    if (bookFID === tableFID) {
                        BFN = folderData[i].folder;//This will get the name of the matching folder.
                        break;//This will end the loop when a folderID match is found!
                    }
                }
                folderDiv.html(BFN);
            } 
            else {
                folderDiv.append("<div class='folderNameDiv'>" + 'Assign a Folder' + "</div");
            }
            //------------------------------------------------------------------------------
            bigBMDiv.append(folderDiv);
            
            
            garbageDiv = $("<div>");
            garbageDiv.addClass("row")
            garbageDiv.addClass("deleteStyle");
            garbageDiv.append("<div class='col-md-3'><button class='garbageBtn'><i class='fas fa-trash-alt'></i></button></div>");
            garbageDiv.attr("id", bookmarkData[j].id);
            bigBMDiv.append(garbageDiv);

            $("#bookmarksDisplay").append(bigBMDiv);
        }
    }


    function postFolders(Folder) {
        console.log("in postFolder:", Folder);
        $.ajax({
            method: "POST",
            url: "https://chrome-bookmark-app.herokuapp.com/api/folders",
            data: Folder
        }).then(function (data) {
            renderFolders();
        });
    };

    function renderFolders() {
        $.ajax({
            method: "GET",
            url: "https://chrome-bookmark-app.herokuapp.com/api/folders",
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
        searchIconDiv.addClass("col-sm-4");
        searchIconDiv.addClass("searchIcon");
        searchIconDiv.attr("data-folderID", folderData.id);
        searchIconDiv.attr("folderId", folderData.id);
        searchIconDiv.append("<button id='folderSort'><i class='fas fa-search'></i></button>");
        folderLine.append(searchIconDiv);
        $("#folderTable").append(folderLine);
    }; 

    function deleteBookmark(id) {
        console.log("in deleteBookmark function", id);
        $.ajax({
            method: "DELETE",
            url: "https://chrome-bookmark-app.herokuapp.com/api/bookmarks/" + id
            // data: info
        }).then(function (data) {
            console.log("Your bookmark has been updated!");
            clearDiv();
            renderBookmarks();
        });  

    }

    function clearDiv() {
        $(".bmBox").remove();
        $(".folderList").remove();
    }

    document.getElementById("searchBookmarks").addEventListener("keyup", function(){
        var input, window, bMark, x;
        input = document.getElementById("searchBookmarks").value.toUpperCase();
        window = document.getElementById("bookmarksDisplay");
        bMark = window.getElementsByClassName("bmBox");
        for (var i = 0; i < bMark.length; i++) {
            x = bMark[i].getElementsByClassName("bmTitleDiv")[0];
            // x = bMark[i].getElementsByTagName("a")[0];
            if (x.innerHTML.toUpperCase().indexOf(input) > -1) {
               bMark[i].style.display = "";
            } 
            else {
               bMark[i].style.display = "none";
            }
        }
    })





    // function getFolderID(folderData){
    //     $.ajax({
    //         method: "GET",
    //         url: "http://localhost:8080/api/folders",
    //     }).then(function (data) {

    //         for(var i = 0; i < data.length; i++){

    //             if(data[i] === folderData){
    //                  ;
    //                 console.log("This is GET folderID: ", data[i].id);
    //                 return data[i].id;
    //             } 
    //         }
    //     });
    // };

    // function updateFolderID(id){
    //     $.ajax({
    //         method: "PUT",
    //         url: "http://localhost:8080/api/bookmarks/",
    //         data: id
    //     }).then(function (data) {
    //         console.log("Update data: ", data);
    //         return data;
    //     });
    // };

    // function getBookmarkFolder(id) {//Renders bookmarks for userID associated with email
    //     $.ajax({
    //         method: "GET",
    //         url: "http://localhost:8080/api/bookmarks/" + id,
    //     }).then(function (data) {
            

    //     });
    // };


});







