//------------------------ home button--------------------------------
window.onload = function () {
   const button = document.getElementById("home-button");
   button.click();
};

//--------------------------- open search------------------------------------
const search = document.querySelector('#search-button');
const searchbar = document.querySelector('#searchbar');
const cover = document.querySelector('#cover-screen');

search.addEventListener('click', function () {

   const w = searchbar.style.left;

   if (w === '75%') {
      searchbar.style.left = '100%';
      cover.style.display = "none";
   }
   else {
      searchbar.style.left = '75%';
      cover.style.display = "block";
   }
});

var au = localStorage.getItem("activeID");
$.post("/set-active-id", { activeID: au }, function (res) {
   console.log('server with user: ', res);
})


$(document).ready(function () {
   //--------------------------------Navbar ---------------------------
   $(window).resize(function () {
      if ($(window).width() > $(window).height()) {
         $('#nav-control').removeClass('fixed-bottom');
      }
      else {
         $('#nav-control').addClass('fixed-bottom');
      }
   });

   $('#searching').focusin(function () {
      $('.bi-search').addClass('glow-icon');
      $('#search-box').addClass('glow-search');
      $('#search-list').css('display', 'block');
   })

   $('#searching').focusout(function () {
      $('.bi-search').removeClass('glow-icon');
      $('#search-box').removeClass('glow-search');
      // $('#search-list').css('display', 'none');
   })

   var au = localStorage.getItem("activeID");
   $("#username").val(au);

   localStorage.setItem("activeID", au);
});

var module = angular.module("myModule", []);

module.directive('ngEnter', function () {
   return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
         if (event.which === 13) { // 13 is the Enter key code
            scope.$apply(function () {
               scope.$eval(attrs.ngEnter, { 'value': element.val() });
            });
            event.preventDefault();
         }
      });
   }
});

module.controller("myController", function ($scope, $http) {

   $scope.jsonArray;
   $scope.fetchsearched = function (event) {
      var url = "/get-searched-records?tofind=" + event.target.value;
      $http.get(url).then(done, fail);
      function done(response) {

         if (response.data == 'no data') {
            $('#search-list').css('display', 'none');
         }
         else {
            if (response.data == null) {
               $('#search-list').css('display', 'none');
            }
            else {
               $('#search-list').css('display', 'block');
               $scope.jsonArray = response.data;
            }
         }
      }
      function fail(response) {
         alert(response);
      }
   };

   $scope.opensearched = function (uname) {
      console.log(uname)
      var url = "/open-searched-one?finder=" + uname;
      $http.get(url).then(done, fail);
      function done(response) {
         // alert("helooo")
         // if(response.length()==7){
         //    alert("its a user");
         // }
         // else{
         //    alert("its a blog");
         // }
      }
      function fail(response) {

      }
   };
});

document.addEventListener('DOMContentLoaded', function () {
   const search = document.getElementById('bottomSearch');

   search.addEventListener('click', function () {
      // Change the color when the element is clicked
      search.style.color = 'red'; // Change text color to red
      search.style.backgroundColor = 'blue'; // Change background color to blue
      search.style.borderColor = 'green'; // Change border color to green
   });
});
