

$(document).ready(function () {

    //validateUser();//This our bookmark render function that runs when page is loaded. 
    //renderFolders();//This is our folder render function that runs when page is loaded.

    // console.log(userObj);
    // document.getElementById("userName").value = localStorage.getItem("BookmarkUserEmail");
    document.getElementById("modaluserName").value = localStorage.getItem("BookmarkUserEmail");
    
    //Global variables
    // var userID;//This is being used in a get request
    var email;
    var folderDetails = [];
    // console.log(userObj); 
    var dragSrcEl = null;


    //drag and drop for folder assignment
    document.drag = function (ev) {
        var x = ev.target.getAttribute("id");
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
        console.log("evttgtid", bookmarkID);
        console.log("dropped this folderID", folderID);
        console.log("in bookmarkID", bookmarkID);
        var bookmarkData = {
            id: bookmarkID,
            FolderId: folderID
        }
        updateBookmarks(bookmarkData);//PUT REQUEST
    }

    //Initial Login pops the modal as the page is loaded
    initialLogIn();

    function initialLogIn(){
        chrome.storage.sync.get(['Email'], function(items) {
            document.getElementById("modaluserName").value = items;
          });
        $('#exampleModal').modal({
            show: true
        });
    }

    // function hideModel(){
    //     $('#exampleModal').modal({
    //         show: false
    //     });
    // }

    
    // document.getElementById('returnUserButton').addEventListener('click', function () {
    //     console.log("Works!");
    //     clearDiv();
    //     email = document.getElementById("userName").value;

    //     localStorage.setItem("BookmarkUserEmail", email);
    //     console.log(email);
    //     validateUser();
    //     renderFolders();
    //     var x = document.querySelectorAll("#bookmarksDisplay")[0];
    //     console.log(x);

    // });

    document.getElementById('returnUserButtonModal').addEventListener('click', function () {
        console.log("Works!");
        clearDiv();
        email = document.getElementById("modaluserName").value;
        localStorage.setItem("BookmarkUserEmail", email);
        console.log(email);
        validateUser();
        renderFolders();
        var x = document.querySelectorAll("#bookmarksDisplay")[0];
        console.log("x from the modal login", x);
        // $('#exampleModal').modal({
        //     show: false
        // });
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
        document.getElementById("addFolder").value = "";

    });

    //keyup to search bookmarks by text input

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

    //on-click to delete a folder
    $(document).on("click", "#trash", function(ev){
        console.log("garbageClicked");
        console.log("event", ev.target);
        console.log("ev", ev.target.getAttribute("gid"));
        var id = ev.target.getAttribute('gid');
        console.log("gid", id);
        deleteBookmark(id);
        // renderBookmark();
    });
    

    //on-click to sort folders by foldername

    document.querySelector("#listOfFolders").addEventListener('click', function(ev){
        console.log("folderSortClicked");
        console.log("ev", ev.target.getAttribute('folderId'));
        var FolderId = ev.target.getAttribute('folderId');
        //var UserId = ev.target.getAttribute('userNo');
        var UserId = userID;
        console.log("user", UserId, "folder", FolderId);
            if (FolderId === "0") {
                console.log( 'AllFoldersClicked');
                validateUser();
            } else {
                console.log('FolderNameClicked', UserId, FolderId);
                sortBookmarks(UserId, FolderId);
            }
        
    })


    function updateBookmarks(info) {
        $.ajax({
            method: "PUT",
            url: "https://chrome-bookmark-app.herokuapp.com/api/bookmarks",
            data: info
        }).then(function (data) {
            console.log("Your bookmark has been updated!");
            clearDiv();
            validateUser();
            renderFolders();
        });
    };

    function validateUser() {
        $.ajax({
            method: "GET",
            url: "https://chrome-bookmark-app.herokuapp.com/api/users",
        }).then(function (data) {
            console.log("validating user", data);
            for (var i = 0; i < data.length; i++) {//Looks for userID associated with email
                var userEmail = data[i].user;
                if (userEmail === email) {
                    userID = data[i].id;
                    getBNF_Tables(userID);
                    $('#exampleModal').modal('hide');
                    // hideModel();
                    break;//This will end the loop when a userID match is found!
                }
                else{
                    document.getElementById("warning_mssg").innerHTML = "Error: User does not exist, please type in existing user";
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
        $('.bmBox').remove();

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

            btnDiv.append("<a href='" + bookmarkData[j].url + "' target='_blank'><button type='button' class='btn btn-sm urlBtn'><i class='fas fa-link'></i></button></a></div>");

            bigBMDiv.append(btnDiv);

            var folderDiv = $("<div>");
            folderDiv.addClass("bmFolderDiv");
            folderDiv.attr("folderId", bookmarkData[j].FolderId);
            folderDiv.attr("id", bookmarkData[j].id );
            folderDiv.attr("ondragover", "allowDrop(event)");
            folderDiv.attr("ondrop", "drop(event)");

            //---------------------------------------------Get folder names for each bookmark
            if (bookmarkData[j].FolderId !== 0) {
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
                folderDiv.append("<div class='folderNameDiv'>" + 'No Folder Assigned' + "</div");
            }
            //------------------------------------------------------------------------------
            bigBMDiv.append(folderDiv);
            
            
            garbageDiv = $("<div>");
            garbageDiv.addClass("row")
            garbageDiv.addClass("deleteStyle");
        garbageDiv.append("<div class='col-md-3'><button class='garbageBtn' id='trash' gid='" + bookmarkData[j].id + "'><i class='fas fa-trash-alt'></i></button></div>");
            garbageDiv.attr("gid", bookmarkData[j].id);
            garbageDiv.attr("id", "trash");
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
        // folderLine.attr("foldername", folderData.folder);
        folderLine.attr("folderId", folderData.id);
        folderLine.attr("userNo", folderData.UserId);

        var folderLabelDiv = $("<div>");
        folderLabelDiv.addClass("col-sm-4");
        folderLabelDiv.addClass("folderLabelDiv");
        folderLabelDiv.attr("userID", folderData.UserId);
        folderLabelDiv.attr("folderName", folderData.folder);
        folderLabelDiv.attr("id", folderData.id);
        folderLabelDiv.attr("draggable", true);
        folderLabelDiv.attr("ondragstart", "drag(event)");

        folderLabelDiv.append("<p class='folderLabelDivText'>" + folderData.folder + "</p>");
        folderLine.append(folderLabelDiv);

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
            validateUser();
            renderFolders();
        });  
    }


    function sortBookmarks(UserId, FolderId) {
        console.log("in sort bookmarks", UserId, FolderId)
        $.ajax({
            method: "GET",
            url: "https://chrome-bookmark-app.herokuapp.com/api/bookmarks/" + UserId + "/" + FolderId
        }).then(function (b_Data) {
            console.log("sort ajax1", b_Data)
            UserID = b_Data[0].UserId;
            console.log("userID", UserID);
            $.ajax({
                method: "GET",
                url: "https://chrome-bookmark-app.herokuapp.com/api/folders/" + UserId,
            }).then(function (f_Data) {
                console.log("ajax 2")
                console.log("bkdata", b_Data, "folderData", f_Data);
                $(".bmBox").remove();
                createBookmarkDiv(b_Data, f_Data);
            });
        });
    };



    function clearDiv() {
        $(".bmBox").remove();
        $(".folderList").remove();
    }



});







