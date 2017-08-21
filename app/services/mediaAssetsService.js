/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

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
                if(list[i].tag !== this.mediaAssets[i].tag) {
                    return false;
                }
            }
            return true;
        }
    }]);
