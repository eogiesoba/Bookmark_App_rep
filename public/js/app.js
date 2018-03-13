var userID;

$(document).ready(function () {

    var BookmarkArray = [];
    var UserInput = $("#userName");
    var folderArr = [];
    document.getElementById("userName").value = localStorage.getItem("BookmarkUserEmail");
    document.getElementById("logoffButton").style.visibility = "hidden";
    var loginEmail;


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
                        if (bookmarks[0].title !== undefined && bookmarks[0].url !== undefined) {
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
    // var email = "faizan.s711@gmail.com"; 
    var email = localStorage.getItem("BookmarkUserEmail");

    document.getElementById('newUserButton').addEventListener('click', function () {

        console.log("Works!");
        email = document.getElementById("userName").value;
       
        if (email === "" || email.indexOf("@") === -1 || email.indexOf(".") === -1) {
            alert("Please input your Gmail address.");
        } else {}

        localStorage.setItem("BookmarkUserEmail", email);
        console.log("email logged in: ", email);
        console.log(email);

        // submitUser(UserPost);//Creates new user in DB
        importUserData();//Gets ID of user and imports user's bookmarks linked to their ID into the DB
    });

    UserInitialCheck();

    function UserInitialCheck(){
        
        importUserData();
        
        console.log("login Email", loginEmail);
        
    }

    document.getElementById('logoffButton').addEventListener('click', function () {
        var email = "";

        LogoffRender();

    });

    function LogoffRender(){
        document.getElementById("userName").style.visibility = "visible";
        document.getElementById("newUserButton").style.visibility = "visible";
        document.getElementById("logoffButton").style.visibility = "hidden";

        document.getElementById("LogInUser").innerHTML = "";
    }

    function LoginRender(){
        document.getElementById("userName").style.visibility = "hidden";
        document.getElementById("newUserButton").style.visibility = "hidden";
        document.getElementById("logoffButton").style.visibility = "visible";


        document.getElementById("LogInUser").append("User: " + email + " has logged in");
    }

    document.getElementById('addBookmark').addEventListener('click', function () {
        console.log("bookmarkAddButton");
        newBookmarkObj = {};
        chrome.tabs.getSelected(null, function (tab) {
            newBookmarkObj.id = tab.id;
            newBookmarkObj.url = tab.url;
            newBookmarkObj.title = document.querySelectorAll("#newBMTitle")[0].value;

        })
        console.log("new", newBookmarkObj);
        addNewBookmark(newBookmarkObj);

    });




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
            var newUser = true;
            // var newBookMarkObj = BookmarkArray;
            for (var i = 0; i < data.length; i++) {//Looks for userID associated with email
                var userEmail = data[i].user;

                console.log("User Data Emails: ", userEmail);
                console.log("email: ", email);

                if (userEmail === email) {
                    userID = data[i].id;
                    newUser = false;
                    loginEmail = userEmail;
                    console.log("login Email: ", loginEmail);
                    break;
                }
                else {
                    userID = data[i].id + 1;
                }

            }

            if (newUser === true) {
                for (var i = 0; i < BookmarkArray.length; i++) {//imports all bookmarks 1 at a time.
                    BookmarkArray[i].userID = userID;
                    var bookObject = BookmarkArray[i];
                    importBookmark(bookObject);
                }
                var UserPost = {
                    user: email
                }
                submitUser(UserPost);
            }

            if(loginEmail === email){
                LoginRender();
            }


            console.log(userID);
            console.log(BookmarkArray);
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


    var postFolders = function (Folder) {
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/api/folders",
            data: Folder
        }).then(function (data) {
            console.log("Your folder has been made.")

        });
    }



    function addNewBookmark(newArr) {
        console.log("You are in the addNewBookmark function!")
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/api/users",
        }).then(function (data) {
            // var UserID = data.id;
            console.log(data);
            // var newBookMarkObj = BookmarkArray;
            for (var i = 0; i < data.length; i++) {//Looks for userID associated with email
                var userEmail = data[i].user;
                if (userEmail === email) {
                    userID = data[i].id
                }
            }
            console.log(userID);
            console.log(newBookmarkObj);

            newBookmarkObj.userID = userID;
            console.log("bookObj", newBookmarkObj);
            bookObject = newBookmarkObj;
            importBookmark(bookObject);
        });
    }

});
