var expect = require("chai").expect;

function checkEmail() {
let user = document.getElementByID("userName")[0].value;
    if (user === "" || user.indexOf("@") === -1 || user.indexOf(".") === -1) {
        alert("Please input your Gmail address.");
    } 
}

checkEmail();

describe("checkEmail", function(){
    it("should confirm if a string has the right characters to be an email address", function(){
        expect(checkEmail("slippa91@gmail.com")).to.equal("slippa91@gmail.com");
    })

    it("should throw an error if it is an empty string", function(){
        expect(checkEmail("")).to.throw(Error);
    })

    it("should throw an error if it is missing an @", function(){
        expect(checkEmail("slippagmail.com")).to.throw(Error);
    })

    it("should throw an error if it is missing an .", function(){
        expect(checkEmail("slippa@gmailcom")).to.throw(Error);
    })

});







