(function () {

    app.directive('customer', Customer);

    /**
     * The <customer> directive is responsible for:
     * - serving customer
     * - calculating queued time
     * - removing customer from the queue
     */
    function Customer($http){

        return{
            restrict: 'E',
            scope:{
                customer: '=',

                onRemoved: '&',
                onServed: '&'
            },
            templateUrl: '/customer/customer.html',
            link: function(scope){

                // calculate how long the customer has queued/waited for
                    scope.customer.queuedTime = function(servedTime, joinedTime){
                        var currentTime = (servedTime) ? new Date(servedTime) : new Date();
                        var qTime = currentTime - new Date(joinedTime);
                        qTime = new Date(qTime);
                        var h = addZero(qTime.getUTCHours(), 2);
                        var m = addZero(qTime.getUTCMinutes(), 2);
                        var s = addZero(qTime.getUTCSeconds(), 2);
                        return h + ":" + m + ":" + s;

                        function addZero(x,n) {
                            if (x.toString().length < n) {
                                x = "0" + x;
                            }
                            return x;
                        }
                    }(scope.customer.servedTime, scope.customer.joinedTime);

                scope.remove = function(){
                    $http({
                        method: 'DELETE',
                        url: '/api/customer/remove',
                        params: {id: scope.customer.id}
                    }).then(function(res){
                        scope.onRemoved()();
                        console.log(res.data);
                    });
                };

                scope.serve = function(){
                    $http({
                        method: 'POST',
                        url: '/api/customer/serve',
                        params: {id: scope.customer.id}
                    }).then(function(res){
                        scope.onServed()();
                        console.log(res.data);
                    });
                };
            }
        }
    }

})()

