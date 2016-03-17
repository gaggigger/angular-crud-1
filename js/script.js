var app = angular.module('http-app', ['oitozero.ngSweetAlert']);

// A solution to run componentHandler.upgradeDom()
// only when a new element is added
app.run(function () {
  var mdlUpgradeDom = false;
  setInterval(function() {
    if (mdlUpgradeDom) {
      componentHandler.upgradeDom();
      mdlUpgradeDom = false;
    }
  }, 200);

  var observer = new MutationObserver(function () {
    mdlUpgradeDom = true;
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

/**
 * --------------------------------------------------
 * Code start here
 * --------------------------------------------------
 */

// Controller
app.controller('UserController', function($scope, $http, SweetAlert) {
  $scope.users = [];
  var url = 'http://localhost:3000/users/';

  // $scope.$watch('users', function(newValue, oldValue) {

  // }, true);

  // GET
  $http({
    method: 'GET',
    url: url
  }).success(function(data) {
    $scope.users = data;
    // console.log($scope.users);
  }).error(function(data, status, headers, config) {
    console.log('Error');
  });

  // DELETE
  $scope.delete = function(id) {
    // Using angular sweet alert to confirm delete or not?
    SweetAlert.swal({
      title: "Are you sure?",
      text: "Are you sure you want to delete?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel plx!",
      closeOnConfirm: false,
      closeOnCancel: false
    },
    // Confirm delete or not?
    function(isConfirm) {
      if (isConfirm) {
        $http({
          method: 'DELETE',
          url: url + id
        });
        SweetAlert.swal("Deleted!", "This todo has been deleted.", "success");
      } else {
        SweetAlert.swal("Cancelled", "This todo is safe :)", "error");
      }
    });
  };

  // CREATE
  $scope.create = function() {
    $http({
      method: 'POST',
      url: url,
      data: {
        id: (new Date()).getTime(),
        name: $scope.name,
        username: $scope.username,
        email: $scope.email,
        address: $scope.address,
        phone: $scope.phone
      }
    }).success(function(data) {
      console.log('Create successed');
    }).error(function(data, status, headers, config) {
      console.log('Create failed');
    });
  };
});
