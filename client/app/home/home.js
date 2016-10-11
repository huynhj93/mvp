angular.module('app.home',[])
	.controller('homeController',function(homeFactory){
		var vm = this;
		vm.name = 'jesses';
		vm.teams = [];
		vm.show = false; 
		vm.playerInput ="";
		vm.playersID =[];
		vm.playerID = [];
		vm.playerStats=[];
		vm.moreThanOnePlayer = false;
		vm.hasData = false;
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
		vm.initialized = function(){
			homeFactory.getPlayerID(vm.playerInput)
				.then(function(resp){
					vm.playersID = resp.data;
				})
		}
		vm.playerClick = function(){
			if (vm.playerInput.length >3){
				vm.show= true;
			}
			console.log("playerclick was clicked");
			homeFactory.getPlayerID(vm.playerInput)
				.then(function(resp){
					console.log('the response.data is:', resp.data);
					var arrDat = resp.data;
					if (resp.data.length >1){
						vm.alert = "Please Enter Only One Player";
						vm.moreThanOnePlayer = true;
					}
					else{
						vm.moreThanOnePlayer = false;
						console.log('i entered here');
						console.log('arrDat is', arrDat[0]);	
						vm.playerID = arrDat[0].player_id;
						var id = vm.playerID;
						console.log("should have player id:",id);
						homeFactory.getPlayerStats(id)
							.then(function(resp){
								console.log('the response to playerstats is:',resp);
								vm.playerStats = resp.data;
								vm.hasData = true;
							})
					}
					// vm.playersID.push(resp.data[0].player_id);
					// vm.playersID = resp.data;
				})

		};
		vm.initialized();
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
			if (arguments.length === 0){
				return $http({
					method: 'POST',
					url:'https://probasketballapi.com/players',
					params:{
						// first_name: paramsArr[0],
						// last_name: paramsArr[1],
						api_key: window.API_KEY,
					}
				})
			}
			else{
				var paramsArr = params.split(' ');
				return $http({
					method: 'POST',
					url:'https://probasketballapi.com/players',
					params:{
						first_name: paramsArr[0],
						last_name: paramsArr[1],
						api_key: window.API_KEY
					}
				})
			}
			console.log('params is:',params);
		}
		var getPlayerStats = function(playerID){
			return $http({
				method: 'POST',
				url: 'https://probasketballapi.com/stats/players',
				params:{
					player_id: playerID,
					api_key: window.API_KEY
					// season: "2015"

				}
			})

		}
		return {
			getPlayerStats: getPlayerStats,
			getPlayerID: getPlayerID,
			getRoute:getRoute,
			getTeams:getTeams
		}
	})