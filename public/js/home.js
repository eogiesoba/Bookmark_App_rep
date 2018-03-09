$(document).ready(function () {


    function loadBookmarksIndex() {
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/api/bookmarks",
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
            bigBMDiv.data("bookmark", bookmarkData);
            bigBMDiv.addClass("col-md-3");
            bigBMDiv.addClass("bmBox");

            var urlDiv = $("<div>");
            urlDiv.addClass("bmTitleDiv");
            var bmTitle = bookmarkData[j].title;
            urlDiv.append(bmTitle);
            bigBMDiv.append(urlDiv);

            var folderDiv = $("div");
            folderDiv.addClass("bmFolderDiv");
            bigBMDiv.append(folderDiv);


            bigBMDiv.attr("href", bookmarkData[j].url);
            bigBMDiv.on("click", function () {
                window.open($(this).attr("href"), '_blank');
            });
            $("#bookmarksDisplay").append(bigBMDiv);
        }
    };

    loadBookmarksIndex();
});