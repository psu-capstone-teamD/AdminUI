angular.module('adminUI')
	.service('S3Service', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

	var params;
	this.bucket;
	
	//Prefilled Credentials
	//Might need to be in Config, might need a Get/Set function if so.
	var creds = {
	    bucket: 'pdxteamdkrakatoa',
	    access_key: 'AKIAIQIBB6LNHBYAZORQ',
	    secret_key: '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'
	}
	

	
	AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
	AWS.config.region = 'us-west-2';
	//Prefilled Server side encryption setting, might need to be moved into config too
	var encryption = 'AES256'
	
	//Workaround to make a simple mock for the S3 object and putObject function
	this.setBucket = function (file) {
		params = { Key: file.name, ContentType: file.type, Body: file, ServerSideEncryption: encryption };
		this.bucket = new AWS.S3({ params: { Bucket: creds.bucket } });
	}
	
	var deferred = $q.defer();
	var unresolved = true;
	
	//Function to upload file to S3 bucket
	this.upload = function (file) {
		this.bucket.putObject(params, function(err, data) {
			if(err) {
				toastr.error(err.message, err.code);
				deferred.reject(err);
				unresolved = false;
			}
			else
			{
				toastr.success('File Uploaded Successfully', 'Done');
				deferred.resolve(data);
				unresolved = false;
			}
		})
		.on('httpUploadProgress',function(progress) {
			$rootScope.$broadcast('progressEvent', progress);
			
			if(progress.loaded == progress.total)
			{
				$rootScope.$broadcast('')
			}
		});
		
		//Workaround for async issue, waits 2000 ms for putObject method to potentially finish
		setTimeout(function() {
			if(unresolved == true)
			{
				toastr.error("PutObject Unresolved", "putObject Unresolved");
				deferred.reject(null);
			}
		}, 2000);
	
	return deferred.promise;
    }
}]);