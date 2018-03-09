$(document).ready(function () {

    console.log("in home.js function");

    function loadBookmarksIndex() {
        $.ajax({
            method: "GET",
            url: "/api/bookmarks",
        }).then(function (data) {
            console.log(data)
            console.log("done!");
            createBookmarkDiv(data);
        });
    };

    function createBookmarkDiv(bookmarkData) {

        console.log(bookmarkData);
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

            // var folderDiv = $("div");
            // folderDiv.addClass("bmFolderDiv");
            // bigBMDiv.append(folderDiv);


            bigBMDiv.attr("href", bookmarkData[j].url);
            bigBMDiv.on("click", function () {
                window.open($(this).attr("href"), '_blank');
            });
            $("#bookmarksDisplay").append(bigBMDiv);
        }
    }
    loadBookmarksIndex();
    });

    