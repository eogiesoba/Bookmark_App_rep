$(document).ready(function () {

    /** 
     * This will store user's email in local storage.
    */
    document.getElementById("modaluserName").value = localStorage.getItem("BookmarkUserEmail");

    /** 
     * Global variables are declared.
    */
    var email;
    var folderDetails = [];
    var dragSrcEl = null;


    /** 
     * Function will collect folderId attribute of element being currently dragged in webpage.
     * @param {obj} ev - Data on the event that just took place.
     * @return {undefined}
    */
    document.drag = function (ev) {
        var x = ev.target.getAttribute("folderId");
        ev.dataTransfer.setData("text", x);
    }

    /** 
     * The default reponse is surpressed on element recieving another dropped element.
     * @param {obj} ev - Data on the event that just took place.
     * @return {undefined}
    */
    document.allowDrop = function (ev) {
        ev.preventDefault();
    }

    /** 
     * This function will get folderId data of element when the elements class is clicked.
     * It will then only render bookmarks that are associated with element's folderId.
     * @param {obj} ev - Data on the event that just took place.
     * @return {undefined}
    */
    document.drop = function (ev) {
        ev.preventDefault();
        var folderID = ev.dataTransfer.getData("text");
        var bookmarkID = ev.target.id;
        var bookmarkData = {
            id: bookmarkID,
            FolderId: folderID
        }
        updateBookmarks(bookmarkData);
    }

    /** 
     * This function will run when user first lands on webapp homepage.
    */
    initialLogIn();

    /** 
     * Function will open modal window when called, in order for user to log in.
     * Modal window is prevented from being closed as well, and can only be closed on login.
     * @return {undefined}
    */
    function initialLogIn() {
        $('#exampleModal').modal({
            show: true,
            keyboard: false,
            backdrop: 'static'
        });
    }

    /** 
     * Function will render whichever user has logged in upper right hand corner of main webpage.
     * @return {undefined}
    */
    function UserloginRender() {
        document.getElementById("userEmail").innerHTML = "";
        document.getElementById("userEmail").append("Logged In: " + email);
    }


    /** 
     * When element ID is clicked function will check if user is in DB.
     * Then it will render all user's bookmark, and folder data if true.
     * Their email will also be stored in local storage.
     * If user is not in DB an error message will be displayed. 
     * @return {undefined}
    */
    document.getElementById('returnUserButtonModal').addEventListener('click', function () {
        console.log("Works!");
        clearDiv();
        email = document.getElementById("modaluserName").value;
        localStorage.setItem("BookmarkUserEmail", email);
        console.log(email);
        validateUser();
        var x = document.querySelectorAll("#bookmarksDisplay")[0];
        console.log("x from the modal login", x);
    });

   
    /** 
     * When element ID is clicked function will submit an new folder associated with user in DB.
     * New folder will then be rendered to the page.  
     * @return {undefined}
    */
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

    /** 
     * Function will prevent user from using the enter key when submitting a new folder.   
     * @return {undefined}
    */
    document.getElementById('addFolder').addEventListener("keypress", function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            e.preventDefault();
        }
    });


    /** 
     * Function will sort bookmarks according to the text input in the search bar window.   
     * @return {undefined}
    */
    document.getElementById("searchBookmarks").addEventListener("keyup", function () {
        var input, window, bMark, x;
        input = document.getElementById("searchBookmarks").value.toUpperCase();
        window = document.getElementById("bookmarksDisplay");
        bMark = window.getElementsByClassName("bmBox");
        for (var i = 0; i < bMark.length; i++) {

            x = bMark[i].getElementsByClassName("bmTitleDiv")[0];
            if (x.innerHTML.toUpperCase().indexOf(input) > -1) {
                bMark[i].style.display = "";
            }
            else {
                bMark[i].style.display = "none";
            }
        }

    })

    /** 
     * Function will prevent user using the enter key when searching for bookmarks.  
     * @return {undefined}
    */
    document.getElementById("searchBookmarks").addEventListener("keypress", function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            e.preventDefault();
        }
    });

    /** 
     * This function will get garbageID (gid) of element when the element's ID is clicked.
     * It will then delete the bookmark in the DB with the id that matches the gid.
     * @param {obj} ev - Data on the event that just took place.
     * @return {undefined}
    */
    $(document).on("click", "#trash", function (ev) {
        console.log("garbageClicked");
        console.log("event", ev.target);
        console.log("ev", ev.target.getAttribute("gid"));
        var id = ev.target.getAttribute('gid');
        console.log("gid", id);
        deleteBookmark(id);
    });

    /** 
     * This function will get the folderid of element when the element's ID is clicked.
     * It will then delete the folder with that folderid and all other bookmarks linked to tht folder.
     * @param {obj} ev - Data on the event that just took place.
     * @return {undefined}
    */
    $(document).on("click", ".deleteFolderBtn", function (ev) {
        if (confirm("Warning: Folder & All associated bookmarks will be deleted. Press OK to continue.")) {
            var id = ev.target.getAttribute('folderid');
            deleteFolder(id);
        }
    });

    /** 
     * Function will delete the folder with that have the same argument id.
     * It will also delete all other bookmarks linked to that folder.
     * @param {number} id - Folder ID number
     * @return {undefined}
    */
    function deleteFolder(id) {
        $.ajax({
            method: "DELETE",
            url: "https://chrome-bookmark-app.herokuapp.com/api/folders/" + id
        }).then(function (data) {
            clearDiv();
            validateUser();
        });
    }


    /** 
     * This function will get folderId data of element when the elements class is clicked.
     * It will then only display bookmarks that are associated with element's folderId.
     * @param {obj} ev - Data on the event that just took place
     * @return {undefined}
    */
    $(document).on("click", ".folderLabelDiv, .AllBookmarks", function (ev) {
        console.log("folderSortClicked");
        console.log("ev", ev.target.getAttribute('folderId'));
        var FolderId = ev.target.getAttribute('folderId');
        var UserId = userID;
        console.log("user", UserId, "folder", FolderId);
        if (FolderId === "0") {
            console.log('AllFoldersClicked');
            validateUser();
        } else {
            console.log('FolderNameClicked', UserId, FolderId);
            sortBookmarks(UserId, FolderId);
        }
    });

    /** 
     * Function will make a PUT request to DB updating the bookmark's folderId data.
     * Bookmarks and Folders will then be re-rendered to the page.
     * @return {undefined}
    */
    function updateBookmarks(info) {
        $.ajax({
            method: "PUT",
            url: "https://chrome-bookmark-app.herokuapp.com/api/bookmarks",
            data: info
        }).then(function (data) {
            console.log("Your bookmark has been updated!");
            clearDiv();
            validateUser();
        });
    };

    /** 
     * Function will make a GET request to DB to check if user is registered in DB. 
     * Bookmarks and Folders will then be rendered to the page if true.
     * If user is not found an error message is sent to user.
     * @return {undefined}
    */
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
                    UserloginRender();
                    getBNF_Tables(userID);
                    renderFolders();
                    $('#exampleModal').modal('hide');
                    // hideModel();
                    break;//This will end the loop when a userID match is found!
                }
                else {
                    document.getElementById("warning_mssg").innerHTML = "Error: User does not exist, please type in existing user";
                }
            }
            console.log(userID);
        });
    }

    /** 
     * Function will get Bookmark and Folder data associated with input user ID.
     * @param {number} id - user's ID number
     * @return {undefined}
    */
    function getBNF_Tables(id) {
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

    /** 
     * Function use Bookmark and Folder data associated with user and render bookmark divs to webpage.
     * @param {array} bookmarkData - An array of user's bookmarks stored as objects in the array.
     * @param {array} folderData - An array of user's folders stored as objects in the array.
     * @return {undefined}
    */
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
            folderDiv.attr("id", bookmarkData[j].id);
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
            garbageDiv.append("<img class='garbageBtn' id='trash' gid='" + bookmarkData[j].id + "' src='../images/Garbage2.png' />");
            garbageDiv.attr("gid", bookmarkData[j].id);
            garbageDiv.attr("id", "trash");
            bigBMDiv.append(garbageDiv);

            $("#bookmarksDisplay").append(bigBMDiv);
        }
    }

    /** 
     * Function will add a new folder associated with user to the DB
     * @param {obj} Folder - User's new folder objects with name of folder and user's ID.
     * @return {undefined}
    */
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

    /** 
     * Function will get all folders from DB and render only user's folder to page.
     * @return {undefined}
    */
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

    /** 
     * Function wil take in an object of data for 1 folder and render div with folder name to page.
     * @param {obj} folderData - User's new folder objects with name of folder and user's ID.
     * @return {undefined}
    */
    function createFolderRows(folderData) {
        console.log(folderData);
        console.log("matching folder!")
        var folderLine = $("<div>");
        folderLine.addClass("row");
        folderLine.addClass("folderList");
        folderLine.attr("folderId", folderData.id);
        folderLine.attr("userNo", folderData.UserId);

        var folderLabelDiv = $("<div>");
        folderLabelDiv.addClass("folderLabelDiv");
        folderLabelDiv.attr("userID", folderData.UserId);
        folderLabelDiv.attr("folderName", folderData.folder);
        folderLabelDiv.attr("folderId", folderData.id);
        folderLabelDiv.attr("draggable", true);
        folderLabelDiv.attr("ondragstart", "drag(event)");
        folderLabelDiv.append("<p class='folderLabelDivText' folderId='" + folderData.id + "' >" + folderData.folder + "</p>");

        var deleteFolderBtn = $("<button> - </button>");
        deleteFolderBtn.addClass("deleteFolderBtn");
        deleteFolderBtn.attr("folderId", folderData.id);

        folderLine.append(deleteFolderBtn);
        folderLine.append(folderLabelDiv);


        $("#folderTable").append(folderLine);
    };

    /** 
     * Function will delete bookmark associated with the bookmark's id
     * @param {number} id - bookmark's ID number.
     * @return {undefined}
    */
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

    /** 
     * Function sorts bookmark associated with the bookmark's folderID.
     * @param {number} UserId - User's ID number
     * @param {number} FolderId - Folder's ID number.
     * @return {undefined}
    */
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


    /** 
     * Function clear last bookmarks and folders that were previously rendered to page to prevent overlapping 
     * of rendered content each time bookmarks and folders are rendered.
     * @return {undefined}
    */
    function clearDiv() {
        $(".bmBox").remove();
        $(".folderList").remove();
    }

});







