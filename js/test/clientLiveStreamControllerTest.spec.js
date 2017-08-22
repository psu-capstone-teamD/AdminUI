/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

describe('ClientClientLiveStreamControllerTests', function(){
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
            ClientLiveStreamController = createClientLiveStreamController();
            expect($scope.skipHlsCheck).toBeFalsy();
            $scope.loadVideo();
            expect(toastr.error).not.toHaveBeenCalled();
        });
        it('should show an error when HLS is not supported', function() {
            ClientLiveStreamController = createClientLiveStreamController();
            $scope.skipHlsCheck = true;
            expect($scope.skipHlsCheck).toBeTruthy();
            $scope.loadVideo();
            expect(toastr.error).toHaveBeenCalled();
        });
    });
});