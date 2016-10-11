angular.module('app',['app.home','ngRoute'])
	.config(function($routeProvider){
		$routeProvider
			.when('/',{
				templateUrl: 'app/home/home.html',
				controller: 'homeController',
				controllerAs: 'vm'
			})
	})