(function () {

    app.directive('addCustomer', AddCustomer);

    function AddCustomer($http){
        return {
            restrict: 'E',
            scope:{
                onAdded: '&'
            },
            templateUrl:'/add-customer/add-customer.html',
            link: function(scope){

                scope.products = [
                    {name: 'Grammatical advice'},
                    {name: 'Magnifying glass repair'},
                    {name: 'Cryptography advice'}
                ];

                scope.add = function(){
                    if(scope.customer.product){
                        $http({
                            method: 'POST',
                            url: '/api/customer/add',
                            data: scope.customer
                        }).then(function(res){
                            scope.onAdded()();
                            console.log(res.data);
                        });
                    } else{
                        alert("Please choose a product");
                    }
                }
            }
        }
    }

})()

