var userID;

$(document).ready(function () {
    //Global Variables
    var BookmarkArray = []; 
    var UserInput = $("#userName");
    var folderArr = [];
    document.getElementById("userName").value = localStorage.getItem("BookmarkUserEmail"); //Gets previous item from extension local stoarage and attaches it to the log in form
    document.getElementById("logoffButton").style.visibility = "hidden"; //hides the logoff button
    var loginEmail;

    //Uses the chrome bookmark API to get all the users bookmarks
    var getBookmarks = (query) => {
        var newArr = [];
        for (i = 0; i < 200; i++) { //forloop for getting each individule bookmsrk from the chrome API
            var x = i.toString();
            var bookmarks = chrome.bookmarks.get(x,
                function (bookmarks) {
                    if (bookmarks[0] !== undefined) {
                        if (bookmarks[0].title !== undefined && bookmarks[0].url !== undefined) {
                            newArr.push(bookmarks[0]);
                        }
                    }
                });
        }
        // console.log("Chrome bookmark extraction: ", newArr);
        return newArr; //returns all the bookmarks in an array
    };

    BookmarkArray = getBookmarks(); //Gets Bookmarks calls the function on top
    //conosle.logs to help test and see if the bookmarks are being extracted
    //console.log("Chrome bookmark extraction: ", BookmarkArray);
    //console.log("hello");

    //This gets local user email if initially logged in
    var email = localStorage.getItem("BookmarkUserEmail");

    //On clikc for Log In chrome extension does not allow us to use jquery so we have to code in vanilla JS
    document.getElementById('newUserButton').addEventListener('click', () => {

        console.log("Works!");
        email = document.getElementById("userName").value;
       
        if (email === "" || email.indexOf("@") === -1 || email.indexOf(".") === -1) {
            alert("Please input your Gmail address.");
        } else {}
        
        localStorage.setItem("BookmarkUserEmail", email);
       //console.log("email logged in: ", email);
        //console.log(email);

        // submitUser(UserPost);//Creates new user in DB
        importUserData();//Gets ID of user and imports user's bookmarks linked to their ID into the DB
    });

    //Initial Check to see if the user in the local storage is an existing user
    UserInitialCheck();

    //Initial check
    function UserInitialCheck(){
        
        importUserData();//calls import data function 
        
        //console.log("login Email", loginEmail);
        
    }


    //On Click for log off button
    document.getElementById('logoffButton').addEventListener('click', function () {
        var email = "";

        LogoffRender();

    });

    //Renders Logoff info, hides the div and shows the log in button and input form
    function LogoffRender(){
        document.getElementById("userName").style.visibility = "visible";
        document.getElementById("newUserButton").style.visibility = "visible";
        document.getElementById("newUserButton").style.height = 38;
        document.getElementById("logoffButton").style.visibility = "hidden";

        document.getElementById("LogInUser").innerHTML = "";
    }

    //hides the input and loggin button and shows log off button
    function LoginRender(){
        document.getElementById("userName").style.visibility = "hidden";
        document.getElementById("newUserButton").style.visibility = "hidden";
        document.getElementById("newUserButton").style.height = 0;
        document.getElementById("logoffButton").style.visibility = "visible";


        document.getElementById("LogInUser").append("Logged In: " + email);
    }

    //On click for adding the current page to user bookmarks
    document.getElementById('addBookmark').addEventListener('click', function () {
        console.log("bookmarkAddButton");
        newBookmarkObj = {};
        chrome.tabs.getSelected(null, function (tab) {
            newBookmarkObj.id = tab.id;
            newBookmarkObj.url = tab.url;
            newBookmarkObj.title = document.querySelectorAll("#newBMTitle")[0].value;

        })
        //console.log("new", newBookmarkObj);
        addNewBookmark(newBookmarkObj);

    });

    //POST function for a new user
    function submitUser(User) {
        $.ajax({
            method: "POST",
            url: "https://chrome-bookmark-app.herokuapp.com/api/users",
            data: User
        }).then(function () {
            // window.location.href = "http://localhost:8080/";
        });
    }

    //GET function 
    function importUserData() {
        console.log("You are in the import function!")
        $.ajax({
            method: "GET",
            url: "https://chrome-bookmark-app.herokuapp.com/api/users",
        }).then(function (data) {
            console.log(data);
            var newUser = true; //this stays true if it is new User
           
            for (var i = 0; i < data.length; i++) {//Looks for userID associated with email through a for loop
                var userEmail = data[i].user;

                //console.log("User Data Emails: ", userEmail);
                //console.log("email: ", email);

                if (userEmail === email) {//compares email to user emails to see if it exists
                    userID = data[i].id;
                    newUser = false; //this being false will not allow user bookmarks to be reposted
                    //loginEmail = userEmail; //this was used to allow the login user to save on the the chrome storage but this is still in the works
                    //console.log("login Email: ", loginEmail);
                    break;
                }
                else {
                    userID = data[i].id + 1;
                }
            }
            //Adds the new user and there bookmark to the databse
            if (newUser === true) {
                for (var i = 0; i < BookmarkArray.length; i++) {//imports all bookmarks 1 at a time.
                    BookmarkArray[i].userID = userID;
                    var bookObject = BookmarkArray[i];
                    //Post request for the bookmarks
                    importBookmark(bookObject);
                }
                var UserPost = {
                    user: email
                }
                //Post request for the user
                submitUser(UserPost);
            }
            //This was used to add the user email t the chrome storage API but would not work
            // if(loginEmail === email){
            //     LoginRender();
            //     chrome.storage.sync.set({
            //         'email': loginEmail 
            //     }, function() {
            //         console.log('Settings saved: ', loginEmail);
            //     });
            // }
            //console.log(userID);
            //console.log(BookmarkArray);
        });
    }

    //POST for the users existing bookmark
    var importBookmark = function (newArr) {
        console.log("you're in the import function and new Arr is: ", newArr);
        $.ajax({
            method: "POST",
            url: "https://chrome-bookmark-app.herokuapp.com/api/bookmarks",
            data: newArr
        }).then(function () {
            //console.log("You imported all Bookmarks!");
        });
    }
    //GET for getting a single bookmark
    function getBookmarks() {
        $.ajax({
            method: "GET",
            url: "https://chrome-bookmark-app.herokuapp.com/api/bookmarks",
        }).then(function () {
            //console.log to see if working
            //console.log("done!");
        });
    }

    //POST for the folders
    var postFolders = function (Folder) {
        $.ajax({
            method: "POST",
            url: "https://chrome-bookmark-app.herokuapp.com/api/folders",
            data: Folder
        }).then(function (data) {
            //console log to see if the code is working
            //console.log("Your folder has been made.")

        });
    }


    //function that checks bookmarks and the posts the new bookmark onto the tables
    function addNewBookmark(newArr) {
        console.log("You are in the addNewBookmark function!")
        $.ajax({
            method: "GET",
            url: "https://chrome-bookmark-app.herokuapp.com/api/users",
        }).then(function (data) {
            // var UserID = data.id;
            //console.log(data);
            // var newBookMarkObj = BookmarkArray;
            for (var i = 0; i < data.length; i++) {//Looks for userID associated with email
                var userEmail = data[i].user;
                if (userEmail === email) {
                    userID = data[i].id
                }
            }
            //console.log(userID);
            //console.log(newBookmarkObj);

            newBookmarkObj.userID = userID;
            //console.log("bookObj", newBookmarkObj);
            bookObject = newBookmarkObj;
            importBookmark(bookObject);
        });
    }

    // //Chrome API set function ICEBOX
    // chrome.storage.sync.set({
    //     'Email': loginEmail 
    //     }, function() {
    //     //console.log('Settings saved');
    //   });

});
