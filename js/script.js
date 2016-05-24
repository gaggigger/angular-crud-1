(function(angular) {
    'use strict';

    angular
        .module('http-app', [
            'oitozero.ngSweetAlert',
            'angular-ladda',
            'toaster',
            'ngAnimate'
        ])
        .config(laddaConfig)
        .controller('UserController', UserController)
        .filter('searchFilter', searchFilter);

    // Function ladda config
    function laddaConfig(laddaProvider) {
        laddaProvider.setOption({
            style: 'expand-right',
            spinnerColor: '#FFF'
        });
    }

    // Function Usercontroller
    function UserController($scope, $http, SweetAlert, $timeout, toaster) {
        $scope.users = [];
        $scope.loadingData = true;
        $scope.toggleText = false;
        $scope.updateUserTurnOn = false;
        var url = 'http://localhost:3000/users/';

        // GET
        // ---
        $http({
            method: 'GET',
            url: url
        }).success(function(data) {
            $scope.users = data;
            $scope.loadingData = false;
            // console.log($scope.users);
        }).error(function(data, status, headers, config) {
            console.log('Error');
        });

        // DELETE
        // ------
        $scope.deleteUser = function(id, index, name) {
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
                    }).success(function() {
                        toaster.pop('success', "Deleted success", "User " + name + " has been deleted");
                        SweetAlert.swal("Deleted!", "This todo has been deleted.", "success");
                    }).error(function() {
                        toaster.pop('error', "Delete failed", "User" + name + "can not be deleted");
                    });
                } else {
                    SweetAlert.swal("Cancelled", "This todo is safe :)", "error");
                }
            });
        };

        // CREATE
        // ------
        $scope.createUser = function() {
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
                // console.log(data);

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
                // console.log('reseted');

                toaster.pop('success', "Created success");
            }).error(function(data, status, headers, config) {
                toaster.pop('error', "Can not created");
            });
        };

        // UPDATE
        // ------
        $scope.updateUser = function(index) {
            $scope.selected = index;
            $scope.updateUserTurnOn = true;
        };

        // $scope.editUser = function(index) {
        //     console.log();
        // }
    }

    // Function search filter
    function searchFilter() {
        return function(arr, searchString) {
            if(!searchString){
                return arr;
            }
            var result = [];
            searchString = String(searchString).toLowerCase();

            angular.forEach(arr, function(item) {
                if(String(item.username).toLowerCase().indexOf(searchString) !== -1) {
                    result.push(item);
                }
            });
            return result;
        };
    }
})(window.angular);
