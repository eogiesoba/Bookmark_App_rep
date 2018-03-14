var expect = require("chai").expect;

function checkEmail() {
    var user;
    if (user === '' || user.indexOf('@') === -1 || user.indexOf('.') === -1) {
        alert("Please input your Gmail address.");
    } 
}

describe("checkEmail", function(){
    
    it("should confirm if a string has the right characters to be an email address", function(){
        expect(checkEmail(user = "slippa91@gmail.com")).to.equal("slippa91@gmail.com");
    })


    it("should throw an error if it is an empty string", function(){
        expect(checkEmail(user = "")).to.throw(Error);
    })

    it("should throw an error if it is missing an '@'", function(){
        expect(checkEmail(user = "slippagmail.com")).to.throw(Error);
    })

    it("should throw an error if it is missing an '.'", function(){
        expect(checkEmail(user = "slippa@gmailcom")).to.throw(Error);
    })

});







