var module = angular.module("testModule", []);
module.controller("testController", function ($scope, $http) {

   $scope.username = localStorage.getItem("activeID");

   $scope.jsonArray = [];
   $scope.fetchBlogs = function () {
      var url = "/get-all-blogs?username=" + $scope.username;
      $http.get(url).then(function(response) {
         $scope.jsonArray = response.data;

         angular.forEach($scope.jsonArray, function (obj) {
            obj.isLiked = obj.liker !== null;
         });
      }, function(response) {
         alert("Failed to fetch blogs: " + response.data);
      });
   }

   $scope.dolike = function (blogid) {
      var url = "/do-blog-like?blogid=" + blogid + "&username=" + $scope.username;
      $http.get(url).then(function(response) {
         var likedBlog = $scope.jsonArray.find(function (blog) {
            return blog.blogid === blogid;
         });

         if (likedBlog) {
            if (response.data === "not liked") {
               likedBlog.isLiked = false;
               likedBlog.likes--;
            } else if (response.data === "liked") {
               likedBlog.isLiked = true;
               likedBlog.likes++;
            }
         }
      }, function(response) {
         alert("Failed to update like: " + response.data);
      });
   }
});
