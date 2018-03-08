$(document).ready(function () {




        // var checkEmail = function() {
        // if (document.querySelectorAll("#userName")[0].value === "" || (document.querySelectorAll("#userName")[0].value).indexOf("@") === -1 || (document.querySelectorAll("#userName")[0].value).indexOf(".") === -1) {
        //     alert("Please input your Gmail address.");
        // } else {
        //     confirmUserStatus();
        // }

        // checkEmail();



    var query = $("search").val();
    var BookmarkArray = [];
    var UserInput = $("#userName");

    var UserPost ={
        user: UserInput.val().trim()
    }



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
    
    document.getElementById('bookmarkWindow').addEventListener('click', function(){
        
        console.log("Works!");
        var newUser = document.getElementById("userName").value;
        console.log(newUser);
        var UserPost ={
            user: newUser
        }
        submitUser(UserPost);
    });

    function submitUser(User) {
        $.ajax({
            method : "POST",
            url: "http://localhost:8080/api/users",
            data: User
        }).then(function(){
            console.log("done!");
        });
    }


    var importBookmark = function(newArr){
        $.ajax({
            method : "POST",
            url: "https://localhost:8080/api/posts",
            data: BookmarkArray
        }).then(function(){
            console.log("Your Bookmarks have been Imported!");
        });
    }

    var deleteBookmark = function(newArr){
        $.ajax({
            method : "DELETE",
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
        });
    }

});

