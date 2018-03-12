var userID;

$(document).ready(function () {

    // var checkEmail = function() {
    // if (document.querySelectorAll("#userName")[0].value === "" || (document.querySelectorAll("#userName")[0].value).indexOf("@") === -1 || (document.querySelectorAll("#userName")[0].value).indexOf(".") === -1) {
    //     alert("Please input your Gmail address.");
    // } else {
    //     confirmUserStatus();
    // }

    // checkEmail();

    // var query = $("search").val();
    var BookmarkArray = [];
    var UserInput = $("#userName");
    var folderArr = [];

    var universalVar = {animal: "Zebra"};



    // var dumpBookmarks = function(query) {
    //   console.log("function");
    // var bookmarkTreeNodes = chrome.bookmarks.getTree(
    //   function(bookmarkTreeNodes) {
    //       console.log("query", query);
    //       console.log("iT", $('#bookmarks').innerText)
    //       console.log("BTN", bookmarkTreeNodes);
    //       console.log("BTN-0", bookmarkTreeNodes[0].children[0].children[0].title);
    //       $('#bookmarks').append("<div>" + bookmarkTreeNodes[0].children[0].children[0].title + "</div>");
    //       $('#bookmarks').append("<div>" + bookmarkTreeNodes[0].children[0].children[1].title + "</div>");
    //   });
    // };

    // dumpBookmarks(query);

    var getBookmarks = function (query) {
        var newArr = [];
        for (i = 0; i < 200; i++) {
            var x = i.toString();
            var bookmarks = chrome.bookmarks.get(x,
                function (bookmarks) {
                    // console.log("Bookmarks", bookmarks);
                    // var newDiv = $("<div>")
                    // newDiv
                    // $('#bookmarks').append("<div>" + bookmarks[0].title + "</div>");
                    if (bookmarks[0] !== undefined) {
                        if(bookmarks[0].title !== undefined && bookmarks[0].url !== undefined){
                            newArr.push(bookmarks[0]);
                        }
                    }
                });
        }
        // console.log("Chrome bookmark extraction: ", newArr);
        return newArr;
    };

    BookmarkArray = getBookmarks();
    console.log("Chrome bookmark extraction: ", BookmarkArray);
    console.log("hello");
    // document.addEventListener('DOMContentLoaded', function() {
    //     var link = document.getElementById('bookmarkWindow');
    //     // onClick's logic below:
    //     link.addEventListener('click', function() {
    //         console.log("hello");
    //         // var loginName = $("#userName")[0].value;
    //         // alert(loginName);
    //     });
    // });

    // document.querySelectorAll("#bookmarkWindow").addEvenListener("click", function (event){
    //     event.preventDefault();

    //     var loginName = $("#userName")[0].value;
    //     alert(loginName);

    //     //Conditional to check if user input data
    //     if (!titleInput.val().trim()) {
    //         return;
    //     }

    //     var UserPost ={
    //         user: loginName
    //     }

    //     console.log(UserPost);

    //     submitUser(UserPost);
    // })
    var email; 

    // document.getElementById('newUserButton').addEventListener('click', function () {

    //     console.log("Works!");
    //     email = document.getElementById("userName").value;
    //     console.log(email);
    //     var UserPost = {
    //         user: email
    //     }
    //     submitUser(UserPost);//Creates new user in DB
    //     importUserData();//Gets ID of user and imports user's bookmarks linked to their ID into the DB

    // });

    document.getElementById('addBookmark').addEventListener('click', function() {
        console.log("bookmarkAddbutton");
        newBookmark = {};
        chrome.tabs.getSelected(null, function(tab) {
            var tabID = tab.id;
            var tabUrl = tab.url;
            newBookmark.url = tab.url
            console.log("url", newBookmark.url);
            newBookmark.title = document.querySelectorAll("#newBMTitle")[0].value;
            console.log("QSA", document.querySelectorAll("#newBMTitle")[0].value);
            console.log(newBookmark.title);
            console.log("in", newBookmark);
            
        })
        console.log("inout", newBookmark);
        updateBookmark(newBookmark);
    });

    console.log("out", newBookmark);

        // importUserData();
    // });

    function submitUser(User) {
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/api/users",
            data: User
        }).then(function () {
            // window.location.href = "http://localhost:8080/";
        });
    }

    function importUserData() {
        console.log("You are in the import function!")
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/api/users",
        }).then(function (data) {
            // var UserID = data.id;
            console.log(data);
            // var newBookMarkObj = BookmarkArray;
            for (var i = 0; i < data.length; i++){//Looks for userID associated with email
                var userEmail = data[i].user;
                if (userEmail === email) {
                    userID = data[i].id
                }
            }
            console.log(userID);
            console.log(BookmarkArray);

            for(var i=0; i < BookmarkArray.length; i++){//imports all bookmarks 1 at a time.
                BookmarkArray[i].userID = userID;
                var bookObject = BookmarkArray[i];
                importBookmark(bookObject);
            }
        });
    }
    //associate this with our folder and our bookmarks

    // var UserObjectArray = getUserData();
    // console.log(UserObjectArray);


    var importBookmark = function (newArr) {
        console.log("you're in the import function and new Arr is: ", newArr);
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/api/bookmarks",
            data: newArr
        }).then(function () {
            console.log("You imported all Bookmarks!");
        });
    }

    function getBookmarks() {
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/api/bookmarks",
        }).then(function () {
            console.log("done!");
        });
    }

    // function relocate() {
    //     $.ajax({
    //         method: "GET",
    //         url: "http://localhost:8080/api/bookmarks",
    //     }).then(function () {
    //         console.log("done!");
    //     });
    // }

    var postFolders = function (Folder) {
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/api/folders",
            data: Folder
        }).then(function (data) {
            console.log("Your folder has been made.")

        });
    }

    function updateBookmark(newArr) {
        $.ajax({
            method: "PUT",
            url: "/api/posts",
            data: BookmarkArray
        })
            .then(function () {
                window.location.href = "/home";
            });
    }





    // var deleteBookmark = function(newArr){
    //     $.ajax({
    //         method : "DELETE",
    //         url: "/api/posts" + id,
    //     }).then(function(){
    //         console.log("Your Bookmark had been Deleted");
    //     });
    // }

    // function updateBookmark(newArr) {
    //     $.ajax({
    //       method: "PUT",
    //       url: "/api/posts",
    //       data: BookmarkArray
    //     })
    //     .then(function() {
    //       window.location.href = "/home";
    //     });
    // }

    // var postFolders = function(newArr){
    //     $.ajax({
    //         method : "POST",
    //         url: "/api/folders",
    //     }).then(function(){

    //     });
    // }

    // var deleteFolder = function(newArr){
    //     $.ajax({
    //         method : "DELETE",
    //         url: "/api/folders" + id,
    //     }).then(function(){
    //         console.log("Your Folder had been Deleted");
    //     });
    // }

    // var postUserData = function(newArr){
    //     $.ajax({
    //         method : "POST",
    //         url: "/api/users",
    //     }).then(function(){

    //     });
    // }

    // var deleteUserData = function(newArr){
    //     $.ajax({
    //         method : "DELETE",
    //         url: "/api/users" + id,
    //     }).then(function(){
    //         console.log("Your user had been Deleted");
    //     });
    // }

});
