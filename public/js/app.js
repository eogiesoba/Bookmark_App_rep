$(document).ready(function () {

    function validateUser(){

        let loginName = $("#userName")[0].value;
        if (loginName === "" || loginName.indexOf("@") === -1 || loginName.indexOf(".") === -1) {
            alert("Please input your Gmail address.");
        } else {
            // localStorage.setItem("userEmail", loginName)
            confirmUserStatus();
        }

        let confirmUserStatus = function() {
        if (!$("#radio1")[0].checked && !$("#radio2")[0].checked) {
            alert("Please select if you are a new or returning user");
        } else if ($("#radio1")[0].checked && $("#radio2")[0].checked) {
            alert("Please select either returning or new user.");
        } else if ($("#radio1")[0].checked && !$("#radio2")[0].checked){
            trigger api call to load existing bookmarks
        } else if (!$("#radio1")[0].checked && $("#radio2")[0].checked){
            trigger api call to post user name and pull bookmarks
        }

    }






    var query = $("search").val();
    var BookmarkArray = [];

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
                    newArr.push(bookmarks[0]);
                });
        }
        console.log(newArr);
        return newArr;

    };

    BookmarkArray = getBookmarks(query);

    var importBookmark = function(newArr){
        $.ajax({
            method : "POST",
            url: "/api/bookmarks",
            data: BookmarkArray
        }).then(function(){
            console.log("Your Bookmarks have been Imported!");
        });
    }

    var deleteBookmark = function(newArr){
        $.ajax({
            method : "DELETE",
<<<<<<< HEAD
            url: "/api/bookmarks" + id,
            data: BookmarkArray
        }).then(function(){
            console.log("Your Bookmarks have been Deleted!")
=======
            url: "/api/posts" + id,
        }).then(function(){
            console.log("Your Bookmark had been Deleted");
        });
    }

    function updateBookmark(newArr) {
        $.ajax({
          method: "PUT",
          url: "/api/posts",
          data: BookmarkArray
        })
        .then(function() {
          window.location.href = "/home";
        });
    }

    var postFolders = function(newArr){
        $.ajax({
            method : "POST",
            url: "/api/folders",
        }).then(function(){
            
        });
    }

    var deleteFolder = function(newArr){
        $.ajax({
            method : "DELETE",
            url: "/api/folders" + id,
        }).then(function(){
            console.log("Your Folder had been Deleted");
        });
    }

    var postUserData = function(newArr){
        $.ajax({
            method : "POST",
            url: "/api/users",
        }).then(function(){
            
        });
    }

    var deleteUserData = function(newArr){
        $.ajax({
            method : "DELETE",
            url: "/api/users" + id,
        }).then(function(){
            console.log("Your user had been Deleted");
>>>>>>> 3a4911c18aab83335960b8b4283a651583c5928c
        });
    }

});

