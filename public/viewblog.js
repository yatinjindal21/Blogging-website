var module = angular.module("testModule", []);
module.controller("testController", function ($scope, $http) {

   $scope.username = localStorage.getItem("activeID");

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
})