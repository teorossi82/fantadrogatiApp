var pippo;
(function(){
    'use strict';
    angular.module("votiModule")
    .service('votiService',["$q","votiFactory", function($q,votiFactory) {
        var vm = this;
        var parseHtmlToJsonVoti = function(ar){
        	var objVoti = {};
        	_.forEach(ar,function(value,key){
        		var obj = {};
        		var team = $(value).find("li .teamName .teamNameIn").html();
        		obj.team = {
        			label:team
        		};
        		var players = [];
        		var playersAr = $(value).find("ul.magicTeamList li");
        		_.forEach(playersAr,function(valP){
        			if($(valP).find(".playerName .playerNameIn a").html()){
	        			var player = {
	        				nome:$(valP).find(".playerName .playerNameIn a").html(),
	        				url:$(valP).find(".playerName .playerNameIn a").attr("href"),
	        				v:parseFloat($(valP).find(".vParameter").html()),
	        				fv:parseFloat($(valP).find(".fvParameter").html())
	        			};
	        			players.push(player);
	        		}
        		});
        		obj.players = players;
        		objVoti[team]=obj;
        	});
        	return objVoti;
        };
        var _voti;
        vm.getVoti = function(giornata){
        	var deferred = $q.defer();
        	var resultGetVoti = votiFactory.getVoti(giornata);
        	resultGetVoti.then(function(data){
        		var parseHtml = $.parseHTML(data);
        		var result = parseHtmlToJsonVoti($(parseHtml).find(".listView .singleRound"));
                _voti=result;
        		deferred.resolve(result); 
        	})
        	.catch(function(err){
        		deferred.reject(err);
        	});
        	return deferred.promise;
        };
        vm.getVotiPlayer = function(player){
            var pl = _.filter(_voti[player.team].players,function(p){
                        var n = player.nome.split(" ")[0].toLowerCase();
                        var pn = p.nome.split(" ")[0].toLowerCase()
                        if(pn.indexOf(n)!==-1)
                            return p;
                    });
            if(pl.length && pl.length>1){
                var a = player.nome.split(" ")[0].toLowerCase()+player.nome.split(" ")[1].toLowerCase();
                var eq = [];
                for(var i=0;i<pl.length;i++){
                    var b = pl[i].nome.split(" ")[0].toLowerCase()+pl[i].nome.split(" ")[1].toLowerCase();
                    var count = 0;
                    _.forEach(b,function(value,key){
                        if(value===a[key])
                            count++
                    });
                    eq[i]=count;
                }
                pl = eq[0]>eq[1] ? [pl[0]] : [pl[1]];
            }
            return pl;
            // var deferred = $q.defer();
            // var promise = vm.getVoti(giornata);
            // promise.then(function(data){
            //     var pl = _.find(data[player.team].players,function(p){
            //         if(p.nome.indexOf(player.nome!==-1))
            //             return p;
            //     })
            //     deferred.resolve(pl); 
            // })
            // .catch(function(err){
            //     deferred.reject(err);
            // });
            // return deferred.promise;
        };
    }]);
})();