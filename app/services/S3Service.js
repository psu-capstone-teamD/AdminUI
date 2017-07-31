angular.module('adminUI')
	.service('S3Service', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

    var $scope = $rootScope;
	var params;
	this.bucket;
	
	//Prefilled Credentials
	//Might need to be in Config, might need a Get/Set function if so.
	$scope.creds = {
	    bucket: 'pdxteamdkrakatoa',
	    access_key: 'REPLACE ME',
	    secret_key: 'REPLACE ME'
	}

	
	AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
	AWS.config.region = 'us-west-2';
	//Prefilled Server side encryption setting, might need to be moved into config too
	var encryption = 'AES256';
	
	//Workaround to make a simple mock for the S3 object and putObject function
	this.setBucket = function (file) {
		params = { Key: file.name, ContentType: file.type, Body: file, ServerSideEncryption: encryption };
		this.bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
	};
	
	
	//Function to upload file to S3 bucket
	this.upload = function (file) {
		var deferred = $q.defer();
		// Let the user know the video is attempting to be uploaded
		toastr.options.showDuration = "375";
		toastr.info('Please wait for upload to finish', 'Uploading...');
		toastr.options.showDuration = "";

		this.bucket.putObject(params, function(err, data) {
			if(err) {
				toastr.error(err.message, err.code);
				deferred.reject(err);
			}
			else
			{
				toastr.success('File Uploaded Successfully', 'Done');
				deferred.resolve(data);
			}
		})
		.on('httpUploadProgress',function(progress) {
			$rootScope.$broadcast('progressEvent', progress);
			
			if(progress.loaded == progress.total)
			{
				$rootScope.$broadcast('')
			}
		});
		return deferred.promise;
    };
}]);