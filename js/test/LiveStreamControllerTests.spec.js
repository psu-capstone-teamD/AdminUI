/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

describe('LiveStreamControllerTests', function(){
	var $scope, schedulerService, LiveStreamController;
    beforeEach(angular.mock.module('adminUI'));

    beforeEach(inject(function($injector, $rootScope, $controller, _schedulerService_) {
        $scope = $rootScope;
		createSchedulerService = function($rootScope) {
            return $injector.get('schedulerService');
        };
		schedulerService = createSchedulerService($scope);
        createLiveStreamController = function() {
           return $controller('LiveStreamController', {
               '$scope': $scope,
			   'schedulerService': schedulerService
           });
        }
    }));

    describe('loadVideo() tests', function() {
        beforeEach(function() {
            spyOn(toastr, "error");
        });
		it('should toast an error message when livestreamURL is an empty string', function() {
			LiveStreamController = createLiveStreamController($scope);
            schedulerService.livestreamURL = '';
            $scope.loadVideo();
            expect(toastr.error).toHaveBeenCalledWith("Please enter an output URL in config.", "Error");
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