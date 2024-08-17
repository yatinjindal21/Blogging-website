$(document).ready(function () {

    //-------------------------tools-clicking---------------------------------
    $('.btn-toggled').click(function () {
       $(this).toggleClass('button-toggle1 button-toggle2');
    });
    $('#text-bg-color').click(function () {
       $('#inputbgtextcolor').focus();
    });


    var au = localStorage.getItem("activeID");
    $("#username").val(au);
    alert(au);
 });


 function execCmd(command) {
    document.execCommand(command, false, null);
 }

 function execCmdWithArg(command, arg) {
    document.execCommand(command, false, arg);
 }

 function changeTextColor(color) {

    if (color != null) {
       document.execCommand('foreColor', false, color);
    }
 }

 function changeTextBGColor(color) {

    if (color != null) {
       document.execCommand('backColor', false, color);
    }
 }

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