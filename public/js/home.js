

$(document).ready(function () {

    if (localStorage.getItem("BookmarkUserEmail")) {
        document.getElementById("userName").value  = localStorage.getItem("BookmarkUserEmail");
    }

    var UserID;
    var email;
    var folderDetails = [];
    // console.log(userObj); 
    var dragSrcEl = null;


    document.drag = function(ev) {
        var target = ev.target;
        var dataArr = [];
        var x = target.getAttribute("folderID");
        dataArr.push(x);
        var y = target.getAttribute("folderName");
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
        target.innerText = dataArr[1];
        target.attribute("FolderId", dataArr[1]);
    }



    document.getElementById('returnUserButton').addEventListener('click', function () {
        console.log("Works!");
        clearDiv();
        email = document.getElementById("userName").value;  
        localStorage.setItem("BookmarkUserEmail", email);
        console.log(email);
        renderBookmarks();
        getFolders();

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
            url: "http://localhost:8080/api/bookmarks/" + id,
        }).then(function (data) {
            console.log(data)
            console.log("done!");


            UserID = data[0].UserId;
            console.log(UserID);

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

            btnDiv.append("<a href='" + bookmarkData[j].url + "' target='_blank'><button type='button' class='btn btn-sm urlBtn'>Click to Page</button></a>");
            btnDiv.append("<button id='garbageBtn'><i class='fas fa-trash-alt'></i></button>");
            bigBMDiv.append(btnDiv);

            var folderDiv = $("<div>");
            folderDiv.addClass("bmFolderDiv");
            console.log("folderId", bookmarkData[j].FolderId);
             if (bookmarkData[j].FolderId !== null) {
                 folderDiv.append("<div id='folderNameDiv'>" + bookmarkData[j].FolderId + "</div>")
             } else {
            folderDiv.append("<div id='folderNameDiv'>Assign a Folder</div>");
             }

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
        console.log("newFolderName", newFolder);
        console.log("userID", UserID);
        var folderObj = {
            folder: newFolder,
            userID: UserID
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
            console.log("Your folder has been made.");
            // console.log(data);
            User
        });

        loadFolderRows(Folder);
    };

    function getFolders() {
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/api/folders",
        }).then(function (data) {
            console.log(data)
            console.log("got arrays!");
            for(var i=0;i<data.length;i++){
                var folderUserID = data[i].UserId;
                console.log("this is folderUserID: ", folderUserID);
                console.log("this is UserID: ", userID);
                console.log("Folder Name: ", data[i].folder )
                console.log("FolderID: ", data[i].id);
                var foldername = data[i];

                if(folderUserID === userID){
                    createFolderRows(foldername);
                }
            }
            // if(folderUserID === userID){
            //     createFolderRows(data);
            // }
        
            
            // createFolderRows(data);

        });
    };

    function createFolderRows(folderData){

        
        // for(var i=0; i<folderData.length; i++) {
            // var folderLine = $("<div>");
            // folderLine.addClass("row");
            // folderLine.addClass("folderList");
            console.log(folderData);

            // var folderLabelDiv = $("<div>");
            // folderLabelDiv.addClass("col-sm-8");
            // folderLabelDiv.addClass("folderLabelDiv");
            // folderLabelDiv.attr("userID", folderData[i].UserId);
            // folderLabelDiv.attr("folderName", folderData[i].folder);
            // folderLabelDiv.attr("folderID", folderData[i].id);
            // console.log("folderLabelInfo UserID:", folderData[i].UserId,"Folder Name: ", folderData[i].folder, folderData[i].id );
            // folderLabelDiv.attr("draggable", true);
            // folderLabelDiv.attr("ondragstart", "drag(event)");
            // if(folderData[i].UserId === userID){
                console.log("matching folder!")
                var folderLine = $("<div>");
                folderLine.addClass("row");
                folderLine.addClass("folderList");

                var folderLabelDiv = $("<div>");
                // folderLabelDiv.addClass("col-sm-8");
                folderLabelDiv.addClass("folderLabelDiv");
                folderLabelDiv.attr("userID", folderData.UserId);
                folderLabelDiv.attr("folderName", folderData.folder);
                folderLabelDiv.attr("folderID", folderData.id);
                folderLabelDiv.attr("draggable", true);
                folderLabelDiv.attr("ondragstart", "drag(event)");

                folderLabelDiv.append("<p class='folderLabelDivText'>" + folderData.folder + "</p>");
                folderLine.append(folderLabelDiv);

                // var searchIconDiv = $("<div>");
                // searchIconDiv.addClass("col-sm-4")
                // searchIconDiv.addClass("searchIcon");
                // searchIconDiv.attr("folderId", folderData.id);
                // searchIconDiv.append("<button id='folderSort'><i class='fas fa-search'></i></button>");
                // folderLine.append(searchIconDiv);
                
                
                $("#sidebar").append(folderLine);
                var BookmarkFolderId= getFolderID(folderData);
                console.log("This is BookmarkFolderID:", BookmarkFolderId);
                
            // }
            // folderLabelDiv.append("<p class='folderLabelDivText'>" + folderData[i].folder + "</p>");
            // folderLine.append(folderLabelDiv);
            
            // var searchIconDiv = $("<div>");
            // searchIconDiv.addClass("col-sm-4")
            // searchIconDiv.addClass("searchIcon");
            // searchIconDiv.attr("folderId", folderData[i].id);
            // searchIconDiv.append("<i class='fas fa-search' id='folderSort'></i>");
            // folderLine.append(searchIconDiv);
            
            
            // $("#sidebar").append(folderLine);
        // }
    };

    function loadFolderRows(folderData) {
        var folderLine = $("<div>");
        folderLine.addClass("folderList");
        console.log(folderData.folder);
        folderLine.append("<div>" + folderData.folder + "</div>");
        $("#sidebar").append(folderLine);
    };

    function clearDiv(){
        $(".bmBox").remove();
        $(".folderList").remove();
    }

    function getFolderID(folderData){
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/api/folders",
        }).then(function (data) {

            for(var i = 0; i < data.length; i++){

                if(data[i] === folderData){
                     ;
                    console.log("This is GET folderID: ", data[i].id);
                    return data[i].id;
                } 
            }
        });
    }

    function updateFolderID(id){
        $.ajax({
            method: "PUT",
            url: "http://localhost:8080/api/bookmarks/",
            data: id
        }).then(function (data) {
            console.log("Update data: ", data);
            return data;
        });
    }

    function getBookmarkFolder(id) {//Renders bookmarks for userID associated with email
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/api/bookmarks/" + id,
        }).then(function (data) {
            

        });
    };


    //get bookmarks AIP call for search
    document.getElementById('sidebar').addEventListener('click', function(ev){
        console.log('Clicked');
        target = ev.target;
        console.log("target", target.innerText);
        
    })
    

});







