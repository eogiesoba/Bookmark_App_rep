//global variable to try and get the extension to communicate with the index but no luck ICEBOX
//var userID;

$(document).ready(function () {

    /** 
     * Global variables are declared.
    */
    var BookmarkArray = []; 
    var UserInput = $("#userName");
    var folderArr = [];
    var loginEmail;

    /**
     * This will get user email to local storage and fill input with previous user email
    */
    document.getElementById("userName").value = localStorage.getItem("BookmarkUserEmail"); 

    /**
     * This eill hide the logoff button
    */
    document.getElementById("logoffButton").style.visibility = "hidden"; 
    

    //Uses the chrome bookmark API to get all the users bookmarks
    /** 
     * This function uses the chrome bookmark API to get all the users bookmarks.
     * @param {obj} query 
     * @return {array} newArr 
    */
    var getBookmarks = (query) => {
        var newArr = [];
        for (i = 0; i < 500; i++) { //forloop for getting each individule bookmsrk from the chrome API
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

    /**
     * This calls the getBookmarks function and saves the returned array to Bookmark Array
    */
    BookmarkArray = getBookmarks(); 

    //conosle.logs to help test and see if the bookmarks are being extracted
    //console.log("Chrome bookmark extraction: ", BookmarkArray);
    //console.log("hello");

    /**
     *This gets local user email if initially logged in
    */
    var email = localStorage.getItem("BookmarkUserEmail");

    /**
     * When element ID is clicked function will check if user is in DB or if it is an actual email.
     * Then it will call the import function to POST new user bookmarks
     * Their email will also be stored in local storage.
     * If user is not in DB it will post users email and bookarks to DB 
     * @return {undefined}
    */
    document.getElementById('newUserButton').addEventListener('click', () => {
        console.log("Works!");
        email = document.getElementById("userName").value;
        if (email === "" || email.indexOf("@") === -1 || email.indexOf(".") === -1) {
            alert("Please input your Gmail address.");
        } else {}
        localStorage.setItem("BookmarkUserEmail", email);

        //console.log("email logged in: ", email);
        //console.log(email);

        //submitUser(UserPost);//Creates new user in DB
        importUserData();
    });

    /**
     * Initial Check call function to see if the user in the local storage is an existing user
    */
    UserInitialCheck();

    /**
     * Initial check fucntion
     * Checks to see if the user is existing in local storahe
     * @return {undefined}
     */
    function UserInitialCheck(){
        
        importUserData();//calls import data function 
        
        //console.log("login Email", loginEmail);
        
    }


    /** 
     * When element ID is clicked function will logoff
     * log off render function will be called
     * email will be set back to an empty strong  
     * @return {undefined}
    */
    document.getElementById('logoffButton').addEventListener('click', function () {
        var email = "";

        LogoffRender();

    });

    /** 
     * Log off render function
     * User input form and login button will be visible
     * logoff button will be hidden and innerHtml will be removed
     * @return {undefined}
    */
    function LogoffRender(){
        document.getElementById("userName").style.visibility = "visible";
        document.getElementById("newUserButton").style.visibility = "visible";
        document.getElementById("newUserButton").style.height = 38;
        document.getElementById("logoffButton").style.visibility = "hidden";

        document.getElementById("LogInUser").innerHTML = "";
    }

    /** 
     * Login Render function.
     * User input form and login button will be hidden
     * logoff button will be visible and innerHtml will render the users email  
     * @return {undefined}
    */
    function LoginRender(){
        document.getElementById("userName").style.visibility = "hidden";
        document.getElementById("newUserButton").style.visibility = "hidden";
        document.getElementById("newUserButton").style.height = 0;
        document.getElementById("logoffButton").style.visibility = "visible";


        document.getElementById("LogInUser").append("Logged In: " + email);
    }

     /** 
     * When element ID is clicked function checks the active chrome tab and gets selected data.
     * New Bookmark is then Posted into the database. 
     * @return {undefined}
    */
    document.getElementById('addBookmark').addEventListener('click',  () => {
        console.log("bookmarkAddButton");
        newBookmarkObj = {};
        chrome.tabs.getSelected(null, (tab) => {
            newBookmarkObj.id = tab.id;
            newBookmarkObj.url = tab.url;
            newBookmarkObj.title = document.querySelectorAll("#newBMTitle")[0].value;

        })
        //console.log("new", newBookmarkObj);
        addNewBookmark(newBookmarkObj);

    });

    /** 
     * Function will Post user data into the use database using the user id.
     * @param {number} User- user's data
     * @return {undefined}
    */
    function submitUser(User) {
        $.ajax({
            method: "POST",
            url: "https://chrome-bookmark-app.herokuapp.com/api/users",
            data: User
        }).then( () => {
            // window.location.href = "http://localhost:8080/";
        });
    }

    /** 
     * Function will get User Data associated with user ID.
     * this function will also check to see if the users email is a new user or existing user
     * will also call the post function for bookmarks and post user information if new user.r
     * @return {undefined}
    */
    function importUserData() {
        console.log("You are in the import function!")
        $.ajax({
            method: "GET",
            url: "https://chrome-bookmark-app.herokuapp.com/api/users",
        }).then((data) => {
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

    /** 
     * Function will Post Bookmark array onto the database.
     * @param {array} newArr - Arr of Bookmark information
     * @return {undefined}
    */
    var importBookmark =  (newArr) => {
        console.log("you're in the import function and new Arr is: ", newArr);
        $.ajax({
            method: "POST",
            url: "https://chrome-bookmark-app.herokuapp.com/api/bookmarks",
            data: newArr
        }).then(() => {
            //console.log("You imported all Bookmarks!");
        });
    }



    /** 
     * Function will get Bookmark and add onto the databse with its associated userID.
     * @param {array} newArr - New Bookmark array
     * @return {undefined}
    */
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
