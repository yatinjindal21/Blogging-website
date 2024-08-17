$(document).ready(function () {

    var au = localStorage.getItem("activeID");
    $("#username").val(au);
 })

 var module = angular.module("myModule", []);
 module.controller("myController", function ($scope, $http) {

    $scope.username = localStorage.getItem("activeID");

    $scope.jsonArray;
    $scope.fetchBlogs = function () {
       var url = "/get-all-blogs?username=" + $scope.username;
       $http.get(url).then(done, fail);
       function done(response) {
          $scope.jsonArray = response.data;

          angular.forEach($scope.jsonArray, function (obj) {
             if (obj.liker != null) {
                obj.isLiked = true;
             }
             else {
                obj.isLiked = false;
             }
          })
       }git 
       function fail(response) {
          alert(response.data);
       }
    }

    $scope.dolike = function (blogid, event) {
       var url = "/do-blog-like?blogid=" + blogid + "&username=" + $scope.username;
       $http.get(url).then(done, fail);
       function done(response) {

          var likedBlogIndex = $scope.jsonArray.findIndex(function (blog) {
             return blog.blogid === blogid;
          })

          if (response.data == "not liked") {
             var button = event.target;
             button.classList.remove('fa-solid');
             button.classList.add('fa-regular');
             if (likedBlogIndex !== -1) {
                $scope.jsonArray[likedBlogIndex].likes--;
             }
          }
          else if (response.data == "liked") {
             var button = event.target;
             button.classList.remove('fa-regular');
             button.classList.add('fa-solid');
             if (likedBlogIndex !== -1) {
           $scope.jsonArray[likedBlogIndex].likes++;
       }
          }
       }
       function fail(response) {
          alert(response.data);
       }
    }

    $scope.redirect = function (blogid) {
       localStorage.setItem("blogID", blogid);
       location.href = `/view-blog/${blogid}`;
    }

 })