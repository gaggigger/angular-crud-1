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
        $scope.temp = {};
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
                    $scope.users.splice(index, 1);
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
            $scope.createLoading = true;
            var formData = $scope.temp;
            formData.id = (new Date()).getTime();

            $http({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                data: $.param(formData)
            }).success(function(data) {
                $scope.createLoading = false;
                $scope.users.push(data);
                console.log(data);

                // Reset input field
                var master = {
                    name: '',
                    username: '',
                    email: '',
                    address: '',
                    phone: ''
                };
                $scope.temp = angular.copy(master);
                $scope.formAdd.$setPristine();
                console.log('reseted');
            }).error(function(data, status, headers, config) {
                console.log('Create failed');
            });
        };
    }
})();
