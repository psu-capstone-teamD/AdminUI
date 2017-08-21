/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

describe('MediaAssetsControllerTests', function(){
	var S3Service, mediaAssetsService, schedulerService, $scope, $q, $rootScope, MediaAssetsController;
	
    beforeEach(angular.mock.module('adminUI'));

    beforeEach(inject(function($injector, $rootScope, $controller, _$q_, _S3Service_, _schedulerService_, _mediaAssetsService_) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope;
        createS3Service = function($rootScope) {
            return $injector.get('S3Service');
        };
        createSchedulerService = function($rootScope) {
            return $injector.get('schedulerService');
        };
        createMediaAssetsService = function($rootScope) {
            return $injector.get('mediaAssetsService');
        }

       $q = _$q_;
       S3Service = createS3Service($scope);
       schedulerService = createSchedulerService($scope);
       mediaAssetsService = createMediaAssetsService($scope);
       createMediaAssetsController = function() {
           return $controller('MediaAssetsController', {
               '$scope': $scope,
               '$rootScope': $rootScope,
               'S3Service': S3Service,
               '$q': $q,
               'mediaAssetsService': mediaAssetsService,
               'schedulerService': schedulerService
           });
       }
    }));
    
    describe('initial load tests', function() {
        it('should successfully load and bind variables', function() {
            MediaAssetsController = createMediaAssetsController($scope, $rootScope, S3Service, $q, mediaAssetsService, schedulerService);
            expect(MediaAssetsController).toBeTruthy();

            expect($scope.mediaAssets).toEqual(mediaAssetsService.mediaAssets);
            expect($scope.S3Objects.length).toBe(0);
            expect($scope.currentURL).toBe("");
            expect($scope.currentFileName).toBe("");
        });
    });
    describe('retrieveS3Objects() tests', function() {
        describe('successful tests', function() {
            beforeEach(function() {
                MediaAssetsController = createMediaAssetsController($scope, $rootScope, S3Service, $q, mediaAssetsService, schedulerService);
                spyOn(AWS, 'S3').and.callFake(function() {
                    return "success";
                });
                spyOn(S3Service, 'setBucket').and.callFake(function() {
                    return "success";
                });
                spyOn(S3Service, 'getItemsInBucket').and.callFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve([{title: "test1", date: "123", url: "foo.com", tag: "456"}, {title: "test2", date: "123", url: "foo.org", tag: "789"}]);
                    return deferred.promise;
                });
                spyOn(mediaAssetsService, 'playlistsAreEqual').and.callFake(function() {
                    return false;
                });
                $scope.S3Objects = [];
                $scope.mediaAssets = [];
            });
            it('should assign S3Objects to the result', function() {
                var mockBucket = "mock";
                var result = $scope.retrieveS3Objects(mockBucket);
                $scope.$digest();
                var expectedS3ObjectsResult = [{title: "test1", date: "123", url: "foo.com", tag: "456"}, {title: "test2", date: "123", url: "foo.org", tag: "789"}];

                expect($scope.S3Objects).toEqual(expectedS3ObjectsResult);
                expect(mediaAssetsService.mediaAssets).toEqual($scope.mediaAssets);
            });
            it('should simply return if the bucket does not exist', function() {
                var result = $scope.retrieveS3Objects();
                $scope.$digest();
                expect(result).toBe(undefined);

            });
        });
        describe('playlists already match', function() {
            beforeEach(function() {
                MediaAssetsController = createMediaAssetsController($scope, $rootScope, S3Service, $q, mediaAssetsService, schedulerService);
                spyOn(AWS, 'S3').and.callFake(function() {
                    return "success";
                });
                spyOn(S3Service, 'setBucket').and.callFake(function() {
                    return "success";
                });
                spyOn(S3Service, 'getItemsInBucket').and.callFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve([{title: "test1", date: "123", url: "foo.com", tag: "456"}, {title: "test2", date: "123", url: "foo.org", tag: "789"}]);
                    return deferred.promise;
                });
                spyOn(mediaAssetsService, 'playlistsAreEqual').and.callFake(function() {
                    return true;
                });
                $scope.S3Objects = [];
                $scope.mediaAssets = [];
            });
            it('should simply return if playlists match', function() {
                var result = $scope.retrieveS3Objects();
                $scope.$digest();
                expect(result).toBe(undefined);

            });
        });
        
        
    });

    describe("updateCurrentS3Video() tests", function() {
        it('should correctly set the file name and URL', function() {
            MediaAssetsController = createMediaAssetsController($scope, $rootScope, S3Service, $q, mediaAssetsService, schedulerService);
            var fileName = "testFile";
            var testURL = "www.foo.com";

            $scope.updateCurrentS3Video(fileName, testURL);
            expect($scope.currentFileName).toBe(fileName);
            expect($scope.currentURL).toBe(testURL);
        });
        it('should correctly handle null values', function() {
            MediaAssetsController = createMediaAssetsController($scope, $rootScope, S3Service, $q, mediaAssetsService, schedulerService);
            var fileName = null; 
            var testURL = null;

            $scope.updateCurrentS3Video(fileName, testURL);
            expect($scope.currentFileName).toBe("");
            expect($scope.currentURL).toBe("");
        });
    });
    describe("addFile() tests", function() {
        beforeEach(function() {
            MediaAssetsController = createMediaAssetsController($scope, $rootScope, S3Service, $q, mediaAssetsService, schedulerService);
            spyOn($scope, '$emit');
        });

        it("should broadcast the correct event and arguments", function() {

            $scope.currentFileName = "test";
            $scope.currentURL = "www.foo.com";
            $scope.title = "test title";
            $scope.category = "TV Show";
            $scope.videoStartTime = new Date();
            $scope.order = 1;

            $scope.addFile();
            expect(S3Service.mediaObject).toEqual({ fileName: $scope.currentFileName, fileURL: $scope.currentURL, title: $scope.title, category: $scope.category, date: $scope.videoStartTime, order: $scope.order});
            expect($scope.$emit).toHaveBeenCalledWith('addS3ToPlaylist', null);
        });

    });

    describe("resetMediaAssetForm() tests", function() {
        beforeEach(function() {
            MediaAssetsController = createMediaAssetsController($scope, $rootScope, S3Service, $q, mediaAssetsService, schedulerService);
            $scope.title = "foo";
            $scope.category = "bar";
            $scope.order = 10;
            $scope.uploadProgress = 100;
            $scope.startTime = "123";
            $scope.videoStartTime = "123";

            spyOn(schedulerService, 'playlistChanged');
        });
        it('should correctly reset the variables when called', function() {
            $scope.resetMediaAssetForm();

            expect($scope.title).toBeNull();
            expect($scope.category).toBe("");
            expect($scope.order).toBe("");
            expect($scope.uploadProgress).toBe(0);
            expect($scope.startTime).toBe("");
            expect($scope.videoStartTime).toBe("");
            
            expect(schedulerService.playlistChanged).toHaveBeenCalled();
        });
    });

    describe('S3AddFinished event tests', function() {
        beforeEach(function() {
            MediaAssetsController = createMediaAssetsController($scope, $rootScope, S3Service, $q, mediaAssetsService, schedulerService);
            spyOn($scope, 'resetMediaAssetForm');
            spyOn(toastr, 'success');
        });

        it('should recognize the event and then call resetMediaAssetForm', function() {
            $scope.$broadcast('S3AddFinished', null);
            
            expect(toastr.success).toHaveBeenCalled();
            expect($scope.resetMediaAssetForm).toHaveBeenCalled();
        });
    });

    describe('VideoCountChanged event tests', function() {
        beforeEach(function() {
            MediaAssetsController = createMediaAssetsController($scope, $rootScope, S3Service, $q, mediaAssetsService, schedulerService);
        });
        it('should correctly assign the videoCount when the event is broadcast', function() {
            $scope.videoCount = 1;
            $scope.$emit('VideoCountChanged', 2);
            expect($scope.videoCount).toBe(2);
        });
    });

});