(function () {

    app.directive('addCustomer', AddCustomer);

    function AddCustomer($http){
        return {
            restrict: 'E',
            scope:{
                onAdded: '&'
            },
            templateUrl:'/components/add-customer/add-customer.html',
            link: function(scope){

                scope.products = [
                    {name: 'Grammatical advice'},
                    {name: 'Magnifying glass repair'},
                    {name: 'Cryptography advice'}
                ];

                scope.customer = {};
                scope.customer.name = null;
                scope.customer.product = null;

                scope.add = function(){
                    var error = "";
                    if(!scope.customer.name){
                        error += "\r\n Please write a name";
                    }
                    if(!scope.customer.product){
                        error += "\r\n Please choose a product";
                    }

                    if(!error){
                        $http({
                            method: 'POST',
                            url: '/api/customer/add',
                            data: scope.customer
                        }).then(function(res){
                            scope.onAdded()();
                            console.log(res.data);
                        });
                    } else{
                        console.log(error);
                    }
                }
            }
        }
    }

})()
