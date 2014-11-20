angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login actieon when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('SearchCtrl', function($scope, $http, $window, $location, $rootScope) {
  $scope.searchTerm = { value : ""};
  $scope.currentLocation ={ latitude:"", longitude:""};
  //$rootScope.searchResult; = {name:"", distance:"", durartion:"", address:"", price:"", mapUrlImg: ""};

    /*
    {"cheapest":{"gas_station_name":"Posto Cajuti de Abastecimento Ltda","lat":-22.9451,"lng":-43.2562,"flag":"esso","gasoline":3.049,"alcohol":2.299,"diesel":2.599,"distance":"15.4 km","duration":"24 mins"}*/
    
    var 
    changeView = function(view){
        console.log($location);
        $location.path(view); // path not hash
    },
    getPostData = function(geoPosition)
    {
        var postData = 
        {
            lat : geoPosition.coords.latitude,
            lng: geoPosition.coords.longitude,
            radius: 10.0,
            type: "GAS",
            flag: "IPIRANGA",
            width: $window.innerWidth,
            height: $window.innerHeight
        }; 
     
        console.log(postData);
        
        return postData;
    },
    executePost = function(postData){
        // Simple POST request example (passing data) :
        console.log("Post Data: " + postData);
        $http.post('http://roadtripgoapi2.jit.su/gas/get_gas_station', postData).
            success(function(data, status, headers, config)
            {    
                var _data = data.cheapest;
                
                console.log(_data);
                
                $rootScope.searchResult = {
                    name: _data.gas_station_name,
                    distance: _data.distance, 
                    duration: _data.duration, 
                    address: _data.address, 
                    price: _data.gasoline,
                    mapUrlImg: _data.maps_url,
                    flag: _data.flag,
                    type: "Gasolina"
                };
          
              //TODO: Change de view
              changeView("app/search-result");
            }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    },
    
    geolocationCtrl = 
    { 
         onSuccess : function(position) {
            var postData = getPostData(position);
                        executePost(postData);
        },
        
        // onError Callback receives a PositionError object
        onError: function(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        },
        getCurrentPosition : function () {
            if(navigator)
            {
                navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, {
                    enableHighAccuracy : true,
                    maximumAge : Infinity,
                    timeout : 15000
                });
            }
        }
    };    
    
    $scope.search = function()
    {
        console.log($scope.searchTerm.value);
        console.log($window.innerHeight);
        console.log($window.innerWidth);
        
        var postData = geolocationCtrl.getCurrentPosition();    
    };
})

.controller('PreferencesCtrl', function($scope, $http) {
    
});
            
