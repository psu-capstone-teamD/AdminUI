// Create a simple test to show that Jasmine is working
describe("Test function", function() {
    it("is a simple test", function() {
        console.log("Test 1:")
        var string = "Hello Elemental!";
        console.log(string)
        expect(string).toEqual("Hello Elemental!");
    });

    it("ensures things are working", function() {
        console.log("Test 2:")
        var testNum = 0;
        console.log(testNum)
        testNum += 1;
        console.log(testNum)

        expect(testNum).toEqual(1);
    });
});