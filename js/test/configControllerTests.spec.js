/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

describe('configControllerTests', function(){
	var S3Service, schedulerService, BSFGeneratorService, ConfigController, $scope;
	
    beforeEach(angular.mock.module('adminUI'));

    beforeEach(inject(function($injector, $rootScope, $controller, _schedulerService_, _BXFGeneratorService_) {
        $scope = $rootScope;
        createSchedulerService = function($rootScope) {
            return $injector.get('schedulerService');
        };
		createBXFGeneratorService = function($rootScope) {
			return $injector.get('BXFGeneratorService');
		};

       schedulerService = createSchedulerService($scope);
	   BXFGeneratorService = createBXFGeneratorService($scope);
       createConfigController = function() {
           return $controller('ConfigController', {
               '$scope': $scope,
               'schedulerService': schedulerService,
			   'BXFGeneratorService': BXFGeneratorService
           });
       }
	}));
	
	describe('initial load tests', function() {
        it('should correctly bind $scope variables', function() {
            // Bind $scope's variables to different things to ensure bindings are correct
            $scope.selectedOptions = 123;
            $scope.options = 123;

            // Create the controller, which binds $scope's variables
            ConfigController = createConfigController($scope, schedulerService, BXFGeneratorService);
            expect($scope.selectedOptions).toEqual(schedulerService.configOptions);
            expect(Object.keys($scope.options).length).toEqual(4);
        });
    })
	
	describe('saveConfig() Test', function() {
		it('should Call the service functions', function() {
			ConfigController = createConfigController($scope, schedulerService, BXFGeneratorService);
			spyOn(schedulerService, 'saveConfig');
			spyOn(BXFGeneratorService, 'setConfig');
			$scope.saveConfig();
			expect(schedulerService.saveConfig).toHaveBeenCalledWith($scope.selectedOptions);
			expect(BXFGeneratorService.setConfig).toHaveBeenCalledWith($scope.selectedOptions);
        });
	})
	
});