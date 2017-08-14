describe('BXFGeneratorService', function(){
	var BXFGeneratorService, $httpBackend;
    beforeEach(angular.mock.module('adminUI'));
    
    beforeEach(inject(function($injector, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        createService = function() {
            return $injector.get('BXFGeneratorService');
        }
    }));
	
	describe('Initial Loading Config Test', function() {
        it('should have 6 keys on load', function() {
			BXFGeneratorService = createService();
			var length = Object.keys(BXFGeneratorService.configSettings).length;
            expect(length).toBe(6);
        });
    });
	
	describe('Initial Loading Schedule', function() {
        it('should have empty parameters on load', function() {
            BXFGeneratorService = createService();
            expect(BXFGeneratorService.videoSchedule.length).toBe(0);

        });
    });
    
    describe('setConfig() tests', function() {
        it('should successfully copy the configurations', function() {
            BXFGeneratorService = createService();
            var config = {"test": "123"};
            BXFGeneratorService.setConfig(config);
            expect(BXFGeneratorService.configSettings).toEqual(config);
        });
    });

    describe('setSchedule() tests', function() {
        it('should successfully copy the schedule', function() {
            BXFGeneratorService = createService();
            var schedule = [{test: "123"}];
            BXFGeneratorService.setSchedule(schedule);
            expect(BXFGeneratorService.videoSchedule).toEqual(schedule);
        });
    });

    describe('getConfig() tests', function() {
        it('should successfully return the configurations', function() {
            BXFGeneratorService = createService();
            BXFGeneratorService.configSettings = {test: "123" };
            var config = BXFGeneratorService.getConfig();
            expect(config).toEqual(BXFGeneratorService.configSettings);
        });
    });

    describe('getSchedule() tests', function() {
        it('should successfully return the videoSchedule', function() {
            BXFGeneratorService = createService();
            BXFGeneratorService.videoSchedule = [{test: "123" }];
            var schedule = BXFGeneratorService.getSchedule();
            expect(schedule).toEqual(BXFGeneratorService.videoSchedule);
        });
    });

    describe('calculateEnd() tests', function() {
       it('should successfully calculate the ending time from the last video', function() {
           BXFGeneratorService = createService();
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
            /*
            BXFGeneratorService = createService();
            BXFGeneratorService.generateBXF();*/
        });
    });

});