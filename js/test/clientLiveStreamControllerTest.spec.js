describe('ClientLiveStreamControllerTests', function(){
	var $scope, ClientLiveStreamController;
    beforeEach(angular.mock.module('clientUI'));

    beforeEach(inject(function($injector, $rootScope, $controller) {
        $scope = $rootScope;
        createClientLiveStreamController = function() {
           return $controller('ClientLiveStreamController', {
               '$scope': $scope,
           });
        }
    }));

    describe('loadVideo() tests', function() {
        beforeEach(function() {
            spyOn(toastr, "error");
        });

        it('should run the video when HLS is supported', function() {
            ClientLiveStreamController = createClientLiveStreamController($scope);
            expect($scope.skipHlsCheck).toBeFalsy();
            $scope.loadVideo();
            expect(toastr.error).not.toHaveBeenCalled();
        });
        it('should show an error when HLS is not supported', function() {
            ClientLiveStreamController = createClientLiveStreamController($scope);
            $scope.skipHlsCheck = true;
            expect($scope.skipHlsCheck).toBeTruthy();
            $scope.loadVideo();
            expect(toastr.error).toHaveBeenCalled();
        });
    });
    
});