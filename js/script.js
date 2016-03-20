(function() {
    'use strict';

    angular
        .module('http-app', [
            'oitozero.ngSweetAlert',
            'angular-ladda'
        ])
        .config(laddaConfig)
        .controller('UserController', UserController);

    // Function ladda config
    function laddaConfig(laddaProvider) {
        laddaProvider.setOption({
            style: 'expand-right',
            spinnerColor: '#fff'
        });
    }

    // Function Usercontroller
    function UserController($scope, $http, SweetAlert, $timeout) {
        var self = this;

        $scope.users = [];
        var url = 'http://localhost:3000/users/';

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
        $scope.delete = function(id, index) {
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
                    $scope.users.splice(index, 1);
                    SweetAlert.swal("Deleted!", "This todo has been deleted.", "success");
                } else {
                    SweetAlert.swal("Cancelled", "This todo is safe :)", "error");
                }
            });
        };

        // CREATE
        $scope.create = function() {
            $scope.createLoading = true;
            $http({
                method: 'POST',
                url: url,
                data: {
                    id: new Date().getTime(),
                    name: $scope.name,
                    username: $scope.username,
                    email: $scope.email,
                    address: $scope.address,
                    phone: $scope.phone
                }
            }).success(function(data) {
                $scope.createLoading = false;
                // $scope.users.push(data);
                // console.log(data);
                // $timeout(function() {
                //   // Reset input field
                //   $scope.name = '';
                //   $scope.username = '';
                //   $scope.email = '';
                //   $scope.address = '';
                //   $scope.phone = '';
                //   console.log('reseted');
                // }, 2000);
            }).error(function(data, status, headers, config) {
                console.log('Create failed');
            });

            console.log(data);
            $timeout(function(){
                $scope.createLoading = false;
            }, 5000);
        };
    }
})();
