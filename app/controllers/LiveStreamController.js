// Define the MediaAssetsController on the adminUI module
angular.module('adminUI')
	.controller('LiveStreamController', ['$scope', function ($scope) {
        $scope.skipHlsCheck = false;
        $scope.loadVideo = function() {
              if(($scope.skipHlsCheck === false) || (Hls.isSupported() !== undefined)) {
                var video = document.getElementById('video');
                var hls = new Hls();
                hls.loadSource('http://delta-1-yanexx65s8e5.live.elementalclouddev.com/out/p/9/it%20me.m3u8');
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED,function() {
                  video.play();
              });
            }
            else {
              toastr.error("Your browswer does not support HLS streaming", "Error");
            }
        }
}]);