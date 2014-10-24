var SailsInstagram = angular.module('SailsInstagram', ['ngSails']);

SailsInstagram.controller('HomeController',[
		'$scope',
		'$sails',
		function($scope, $sails){
			$scope.welcome = "Another Instagram App";
			$scope.items = [];

			$sails.get('/tag')
				.success(function(data){
					$scope.items = data.data;
				});

			io.socket.on('show',function(msg){
				console.log(msg);
			})
		}
	])