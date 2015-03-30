'use strict';

angular.module('WordRiverApp')
  .controller('WordManagerCtrl', function ($scope, $http, socket, Auth) {
    $scope.categoryField = "";
    $scope.addField = "";
    $scope.searchField = "";
    $scope.categoryArray = [];
    $scope.currentUser = Auth.getCurrentUser();
    $scope.selectedCategories = [];
    $scope.allTiles = [];
    $scope.userTiles = [];
    $scope.myCheck =

    $scope.getCategories = function() {
        $scope.categoryArray = $scope.currentUser.contextPacks;
      };

    $scope.getCategories();


    $scope.deletePack = function(index) {
      $http.delete('/api/packs/' + $scope.contextPacks[index]._id)
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('pack');
    });

    $scope.addCategory = function () {
      if ($scope.categoryField.length >= 1) {
        $scope.categoryArray.push($scope.categoryField);
        $http.patch('/api/users/' + $scope.currentUser._id + '/category',
          {contextPacks: $scope.categoryArray}
        ).success(function(){
            console.log('success?');
          });
      }
      $scope.categoryField="";
      $scope.getCategories();
    };

    $scope.getWords = function(){
      $scope.userTiles = [];
      $http.get('/api/tile').success(function(allTiles) {
        $scope.allTiles = allTiles;
        for(var i= 0; i < $scope.allTiles.length; i++){
          if($scope.currentUser._id == $scope.allTiles[i].creatorID){
            $scope.userTiles.push($scope.allTiles[i]);
          }
        }
      });
    };
    $scope.getWords();

    $scope.addWord = function() {
      if ($scope.addField.length >= 1) {
        $scope.allCheckedWords();
        console.log($scope.selectedCategories.length);
        console.log($scope.selectedCategories[0]);
        $http.post('/api/tile', {
          name: $scope.addField,
          contextTags: $scope.selectedCategories,
          creatorID: $scope.currentUser._id
        });
        $scope.addField = "";
        $scope.getWords();
        $scope.selectedCategories = [];
        //$scope.unCheckAllCheckboxes();
      }
    };

    $scope.allCheckedWords = function(object){
      object.value = !object.value;
      $scope.isChecked = false;
      if(object.value==!$scope.isChecked){
        console.log('true');
        $scope.selectedCategories.push(object.words);
        console.log(object.words);
      }
      else if(object.value == false){
        console.log("false");
      }
    };

    $scope.unCheckAllCheckboxes = function(field){
      for (var i = 0; i < field.length; i++){
        field[i].checked = false;
      }
    };

  //
  //  $scope.deleteWord = function(pack, index) {
  //    pack.tiles.splice(index, 1);
  //    $http.patch('/api/packs/' + pack._id,
  //      {tiles: pack.tiles}
  //    ).success(function() {
  //        console.log("Patch completed!");
  //        console.log($scope.contextPacks);
  //      });
  //    //$http.post('/api/packs', {packName: pack.packName, tiles: pack.tiles});
  //    //$http.delete('/api/packs/' + pack._id);
  //  };
  });
