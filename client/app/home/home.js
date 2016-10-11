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
		vm.gameID ="";
		vm.everyGameIDPlayerPlayed =[];
		vm.games = [];
		vm.moreThanOnePlayer = false;
		vm.hasData = false;
		vm.finalStats =[];
		vm.showStats = false;

		vm.points = 0;
		vm.assists = 0;
		vm.blocks = 0;
		vm.rebounds = 0;
		vm.steals = 0;
		vm.opponentID;
		vm.opponent;
		vm.teamClick = function(){
			// homeFactory.getRoute()
			// 	.then(function(resp){
			// 		console.log('resp from my server is:',resp);
			// 	})
			homeFactory.getTeams(vm.teamInput)
				.then(function(resp){
					console.log('team id response is:',resp.data);
					vm.teams = (resp.data);
				})
				.catch(function(err){
					console.log('err is:',err);
				})
		};
		vm.teamClick();
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
								console.log('the response to playerstats is:',resp.data);
								vm.playerStats = resp.data;
								vm.hasData = true;
								var arr1 = [];
								for (var i=0; i< vm.playerStats.length; i++){

									var player = vm.playerStats[i];
									arr1.push(player.game_id);
								}
								vm.everyGameIDPlayerPlayed = arr1;	

								console.log("game id array is",vm.everyGameIDPlayerPlayed);
								// var game = vm.everyGameIDPlayerPlayed[33];
								// homeFactory.getGames(game)
								// 	.then(function(resp){
								// 		console.log("player game stats from game 0 are:",resp);
								// 	})
								var games = [];
								vm.games = [];

								for (var i=0; i <vm.everyGameIDPlayerPlayed.length;i++){
									// if (i === vm.everyGameIDPlayerPlayed.length-1){
									// 	console.log("vm.games should contain every game",vm.games);

									// }

									var gameI= vm.everyGameIDPlayerPlayed[i];
									console.log(gameI);
									homeFactory.getGames(gameI)
										.then(function(resp){
											// console.log("player game stats inside the for loop is:",resp);
											// games.push(resp.data[0]);
											resp.data[0].date = resp.data[0].date.slice(0,10);
											vm.games.push(resp.data[0]);
											console.log('vm games should contatin 1 game only',vm.games);
										})
								}
								// vm.games = games;
								//for each game, get the date of the game

							})
					}
					// vm.playersID.push(resp.data[0].player_id);
					// vm.playersID = resp.data;
				})

		};
		vm.dateClick = function(){
			vm.finalStats = [];
			console.log("I WAS CLICKEDDDD");
			var id =0;
			for (var i=0; i <vm.games.length;i++){
				var game = vm.games[i];
				var date = game.date.slice(0,10);
				console.log("the date is:",date);
				if (date === vm.gameDateInput){
					id = game.id;
					break;
				}
			}
			for (var j=0;j<vm.playerStats.length;j++){
				var gameStats = vm.playerStats[j];
				if (gameStats.game_id === id){
					vm.points = gameStats.box_pts;
					vm.assists = gameStats.box_ast;
					vm.blocks = gameStats.box_blk;
					vm.rebounds = Number(gameStats.box_oreb)+Number(gameStats.box_dreb);
					vm.steals = gameStats.box_stl;
					vm.opponentID = gameStats.opponent_id;
					console.log("I MADE IT!");
				}
			}
			for (var k=0; k < vm.teams.length; k++){
				if (vm.teams[k].team_id === vm.opponentID){
					vm.opponent = vm.teams[k].team_name;
					vm.showStats = true;

				}
			}
			// for (var i=0; i<vm.playerStats.length;i++){
			// 	var obj = vm.playerStats[i];
			// 	if (obj.game_id ===){}
			// }
		}
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
		var getGames = function(gameID){
			return $http({
				method: 'POST',
				url:'http://api.probasketballapi.com/game',
				params:{
					api_key: window.API_KEY,
					game_id: gameID
				}
			})
		}
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
			getGames: getGames,
			getPlayerStats: getPlayerStats,
			getPlayerID: getPlayerID,
			getRoute:getRoute,
			getTeams:getTeams
		}
	})