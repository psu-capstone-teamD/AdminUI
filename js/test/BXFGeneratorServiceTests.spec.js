/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

describe('BXFGeneratorService', function(){
	var BXFGeneratorService, $httpBackend, uuid, lambdaService, $rootScope;
	var url = "/generatebxf";
    beforeEach(angular.mock.module('adminUI'));
    
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
		uuid = $injector.get('uuid');
		lambdaService = $injector.get('lambdaService');
		$rootScope = $injector.get('$rootScope');
        createService = function($httpBackend, uuid, lambdaService, $rootScope) {
            return $injector.get('BXFGeneratorService');
        }
    }));
	
	describe('Initial Loading Config Test', function() {
        it('should have 6 keys on load', function() {
			BXFGeneratorService = createService($httpBackend, uuid, lambdaService, $rootScope);
			var length = Object.keys(BXFGeneratorService.configSettings).length;
            expect(length).toBe(6);
        });
    });
	
	describe('Initial Loading Schedule', function() {
        it('should have empty parameters on load', function() {
            BXFGeneratorService = createService($httpBackend, uuid, lambdaService, $rootScope);
            expect(BXFGeneratorService.videoSchedule.length).toBe(0);

        });
    });
    
    describe('setConfig() tests', function() {
        it('should successfully copy the configurations', function() {
            BXFGeneratorService = createService($httpBackend, uuid, lambdaService, $rootScope);
            var config = {"test": "123"};
            BXFGeneratorService.setConfig(config);
            expect(BXFGeneratorService.configSettings).toEqual(config);
        });
    });

    describe('setSchedule() tests', function() {
        it('should successfully copy the schedule', function() {
            BXFGeneratorService = createService($httpBackend, uuid, lambdaService, $rootScope);
            var schedule = [{test: "123"}];
            BXFGeneratorService.setSchedule(schedule);
            expect(BXFGeneratorService.videoSchedule).toEqual(schedule);
        });
    });

    describe('getConfig() tests', function() {
        it('should successfully return the configurations', function() {
            BXFGeneratorService = createService($httpBackend, uuid, lambdaService, $rootScope);
            BXFGeneratorService.configSettings = {test: "123" };
            var config = BXFGeneratorService.getConfig();
            expect(config).toEqual(BXFGeneratorService.configSettings);
        });
    });

    describe('getSchedule() tests', function() {
        it('should successfully return the videoSchedule', function() {
            BXFGeneratorService = createService($httpBackend, uuid, lambdaService, $rootScope);
            BXFGeneratorService.videoSchedule = [{test: "123" }];
            var schedule = BXFGeneratorService.getSchedule();
            expect(schedule).toEqual(BXFGeneratorService.videoSchedule);
        });
    });

    describe('calculateEnd() tests', function() {
       it('should successfully calculate the ending time from the last video', function() {
           BXFGeneratorService = createService($httpBackend, uuid, lambdaService, $rootScope);
           var date = new Date();
           var lastVideo = {date: date, totalSeconds: 10};
           var result = BXFGeneratorService.calculateEnd(lastVideo);
           date.setSeconds(date.getSeconds() + 10);
           var expectedResult = new Date(date);
           expect(result).toEqual(expectedResult);
       });
    });

    describe('generateBXF() tests', function() {
        it('should sucessfully generate a valid BXF', function() {
			BXFGeneratorService = createService($httpBackend, uuid, lambdaService, $rootScope);
			var mockVideos = [{date: '112233', uuid: '123', order: '1', title: 'mockTitle', duration: 'mockDuration', file: 'mockFile'}];
			var msg = "<test><header>Test header</header><body>Test body</body></test>"
			var result = '';
			var response;
			$httpBackend.expectPOST(url).respond(function () {
				result = msg;
				return [200, msg];
			});
			spyOn(uuid, 'v4').and.returnValue('12345');
			spyOn(angular, 'toJson').and.returnValue('JsonObj');
			spyOn(toastr, 'success');
			spyOn(lambdaService, 'sendBXF');
			response = BXFGeneratorService.generateBXF(mockVideos);
			$httpBackend.flush();
			expect(toastr.success).toHaveBeenCalledWith('BXF Successfully Generated', 'Done');
			expect(lambdaService.sendBXF).toHaveBeenCalled();
			expect($rootScope.playlistPublished).toBe(true);
			expect(result).toBe(msg);
        });
		it('should fail', function() {
			BXFGeneratorService = createService($httpBackend, uuid, lambdaService, $rootScope);
			var mockVideos = [{date: '11/22/33', uuid: '123', order: '1', title: 'mockTitle', duration: 'mockDuration', file: 'mockFile'}];
			var result = '';
			var response;
			$httpBackend.expectPOST(url).respond(function () {
				result = 'Error';
				return [404, 'ERROR'];
			});
			spyOn(uuid, 'v4').and.returnValue('12345');
			spyOn(angular, 'toJson').and.returnValue('JsonObj');
			spyOn(toastr, 'error');
			response = BXFGeneratorService.generateBXF(mockVideos);
			$httpBackend.flush();
			expect(toastr.error).toHaveBeenCalledWith('BXF Generation Error', 'Error');
			expect(result).toBe('Error');
		});
    });
});