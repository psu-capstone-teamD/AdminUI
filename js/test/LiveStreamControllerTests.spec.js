describe('LiveStreamControllerTests', function(){
	var $scope, LiveStreamController;
    beforeEach(angular.mock.module('adminUI'));

    beforeEach(inject(function($injector, $rootScope, $controller) {
        $scope = $rootScope;
        createLiveStreamController = function() {
           return $controller('LiveStreamController', {
               '$scope': $scope,
           });
        }
    }));

    describe('loadVideo() tests', function() {
        beforeEach(function() {
            spyOn(toastr, "error");
        });

        it('should run the video when HLS is supported', function() {
            LiveStreamController = createLiveStreamController($scope);
            expect($scope.skipHlsCheck).toBeFalsy();
            $scope.loadVideo();
            expect(toastr.error).not.toHaveBeenCalled();
        });
        it('should show an error when HLS is not supported', function() {
            LiveStreamController = createLiveStreamController($scope);
            $scope.skipHlsCheck = true;
            expect($scope.skipHlsCheck).toBeTruthy();
            $scope.loadVideo();
            expect(toastr.error).toHaveBeenCalled();
        });
    });
    
});