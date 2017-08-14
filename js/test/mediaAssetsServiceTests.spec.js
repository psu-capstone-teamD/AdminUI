describe('mediaAssetsService', function(){
	var mediaAssetsService, $rootScope;
	
    beforeEach(angular.mock.module('adminUI'));
    
    beforeEach(inject(function($injector) {
		$rootScope = $injector.get('$rootScope');
        createService = function($rootScope) {
           return $injector.get('mediaAssetsService');
        }
    }));

    describe('initial load tests', function() {
        it('should have an empty mediaAssets variable on load', function() {
            mediaAssetsService = createService($rootScope);
            expect(mediaAssetsService.mediaAssets.length).toBe(0);
        });
    });

    describe('playlistsAreEqual() tests', function() {

        it('should immmediately return false when the lengths are different', function() {
            mediaAssetsService = createService($rootScope);

            testList = [{title: "test", tag: "testTag"}, 
                        {title: "anotherTest", tag: "testTag"}]; 
            var result = mediaAssetsService.playlistsAreEqual(testList);
            expect(result).toBeFalsy();
        });
        it('should immmediately return false when the list is null', function() {
            mediaAssetsService = createService($rootScope);

            testList = null;
            var result = mediaAssetsService.playlistsAreEqual(testList);
            expect(result).toBeFalsy();
        });
        
        it('should return false when the title does not match', function() {
            mediaAssetsService = createService($rootScope);

            mediaAssetsService.mediaAssets = [{title: "test", tag: "testTag"}, 
                        {title: "anotherTest", tag: "testTag"}]; 
            testList = [{title: "test2", tag: "testTag"}, 
                        {title: "anotherTest", tag: "testTag"}]; 
            
            var result = mediaAssetsService.playlistsAreEqual(testList);
            expect(result).toBeFalsy();
        });

        it('should return false when the tags does not match', function() {
            mediaAssetsService = createService($rootScope);

            mediaAssetsService.mediaAssets = [{title: "test", tag: "testTag"}, 
                        {title: "anotherTest", tag: "testTag"}]; 
            testList = [{title: "test", tag: "testTag123"}, 
                        {title: "anotherTest", tag: "testTag"}];
            
            var result = mediaAssetsService.playlistsAreEqual(testList);
            expect(result).toBeFalsy();
        });


        it('should return true when the lists match', function() {
            mediaAssetsService = createService($rootScope);

            mediaAssetsService.mediaAssets = [{title: "test", tag: "testTag"}, 
                        {title: "anotherTest", tag: "testTag"}]; 
            testList = [{title: "test", tag: "testTag"}, 
                        {title: "anotherTest", tag: "testTag"}]; 
            
            var result = mediaAssetsService.playlistsAreEqual(testList);
            expect(result).toBeTruthy();
        });
    });

});