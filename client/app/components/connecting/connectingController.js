angular.module('connecting', [
		'utils'
	])
.controller('connectingController', ['$scope', '$http', '$stateParams', '$rootScope', 'fileUpload', 'linkGeneration', 'webRTC', function($scope, $http, $stateParams, $rootScope, fileUpload, linkGeneration, webRTC){

	/**
		* if arriving from redirect,
		* sender has access to their own peer object,
		* becasue it's on the $rootScope
		*
		* if arriving from a link,
		* follow the code below:
		*/

	if(!$rootScope.peer){
  	
  	$rootScope.myItems = [];

		$rootScope.peer = webRTC.createPeer();
		
		$rootScope.peer.on('open', function(id) {
      // TODO: create special link to send with post in data
      $http({
        method: 'POST',
        url: '/api/webrtc/users',
        // TODO: change 
        // url: '/api/webrtc/recipient',
        data: {
          hash: $stateParams.test
        }
      })
      .then(function(res) {
      	// expect res.data === sender id
      	$rootScope.conn = $rootScope.peer.connect(res.data);
      	$rootScope.conn.on('data', function(data) {
      		console.log('recipient data',data);
      	});
      });
    });

    document.getElementById('filesId').addEventListener('change', function() {
    	
    	var files = this.files;
  		for (var i = 0; i < files.length; i++) {
    		$rootScope.myItems.push(files[i]);
  		}
  		webRTC.ping($rootScope.conn);
    });
	}

}]);