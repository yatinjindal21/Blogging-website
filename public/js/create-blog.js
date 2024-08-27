$(document).ready(function () {

   var au = localStorage.getItem("activeID");
   $("#username").val(au);
   //  alert(au);
});


var module = angular.module("myModule", []);
module.controller("myController", function ($scope, $http) {

   $scope.jsonArray;

   $scope.username = localStorage.getItem("activeID");

   $scope.fetchPublisher = function () {
      var url = "/get-publisher?uname=" + $scope.username;
      $http.get(url).then(done, fail);
      function done(response) {
         $scope.jsonArray = response.data;
      }
      function fail(response) {
         alert(response.data);
      }
   }
})

function doPrev(refFile, prevImg) {
   const [file] = refFile.files
   if (file) {
      prevImg.src = URL.createObjectURL(file)
   }
}