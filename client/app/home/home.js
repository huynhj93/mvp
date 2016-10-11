angular.module('app.home',[])
	.controller('homeController',function(homeFactory){
		var vm = this;
		vm.name = 'jesses';
		vm.teams = [];
		vm.show = false; 
		vm.playerInput ="";

		vm.playersID =[];
		vm.teamClick = function(){
			// homeFactory.getRoute()
			// 	.then(function(resp){
			// 		console.log('resp from my server is:',resp);
			// 	})
			homeFactory.getTeams(vm.teamInput)
				.then(function(resp){
					console.log('resp is:',resp);
					vm.teams = (resp.data);
				})
				.catch(function(err){
					console.log('err is:',err);
				})
		};
		vm.playerClick = function(){
			if (vm.playerInput.length >3){
				vm.show= true;
			}
			console.log("playerclick was clicked");
			homeFactory.getPlayerID(vm.playerInput)
				.then(function(resp){
					console.log('id of chris paul is:', resp.data[0].player_id);
					// vm.playersID.push(resp.data[0].player_id);
					vm.playersID = resp.data;
				})

		};
		vm.playerClick();

	})
	.factory('homeFactory',function($http){
		var name = 'jonny';
		var getRoute = function(){
			return $http({
				method: 'GET',
				url:'/api/place'
			})

		};
		var getTeams = function(params){
			return $http({
				method: 'POST',
				url: 'https://probasketballapi.com/teams',
				params: {
					team_name: params,
					api_key: window.API_KEY
				}

			})
		}
		var getPlayerID = function(params){
			// var paramsArr = params.split(' ');
			// console.log(paramsArr);
			console.log('params is:',params);
			return $http({
				method: 'POST',
				url:'https://probasketballapi.com/players',
				params:{
					// first_name: paramsArr[0],
					// last_name: paramsArr[1],
					api_key: window.API_KEY
				}
			})
		}
		return {
			getPlayerID: getPlayerID,
			getRoute:getRoute,
			getTeams:getTeams
		}
	})