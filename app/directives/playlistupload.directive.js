/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

'use strict';


angular.module('adminUI')
	.directive('file', function() {
	  return {
		restrict: 'AE',
		scope: {
		  file: '@'
		},
		link: function(scope, el, attrs){
		  el.bind('change', function(event){
			var files = event.target.files;
			var file = files[0];
			scope.file = file;
			scope.$parent.file = file;
			scope.$apply();
		  });
		}
  };
});