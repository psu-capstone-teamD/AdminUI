angular.module('adminUI')
    .service('mediaAssetsService', ['$rootScope', function ($rootScope) {
        this.mediaAssets = [];

        this.playlistsAreEqual = function(list) {
            if((list === null) || (list.length !== this.mediaAssets.length)) {
                return false;
            }
            for(var i = 0; i < list.length; i++) {
                if(list[i].title !== this.mediaAssets[i].title) {
                    return false;
                }
                if(list[i].date !== this.mediaAssets[i].date) {
                    return false;
                }
                if(list[i].url !== this.mediaAssets[i].url) {
                    return false;
                }
            }
            return true;
        }
    }]);
