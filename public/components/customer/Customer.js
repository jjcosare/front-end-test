(function () {

    app.directive('customer', Customer);

    /**
     * The <customer> directive is responsible for:
     * - serving customer
     * - calculating queued time
     * - removing customer from the queue
     */
    function Customer($http, $interval){

        return{
            restrict: 'E',
            scope:{
                customer: '=customer',

                onRemoved: '&',
                onServed: '&'
            },
            templateUrl: '/components/customer/customer.html',
            link: function(scope, element){

                // calculate how long the customer has queued/waited for
                scope.customer.queuedTime = momentCalculator(scope.customer.servedTime, scope.customer.joinedTime);

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

                function momentCalculator(servedTime, joinedTime){
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
                };

                var tickingQueuedTime = $interval(function(){
                    scope.customer.queuedTime = momentCalculator(scope.customer.servedTime, scope.customer.joinedTime);
                    //console.log('tickingQueuedTime', scope.customer.name);
                }, 1000);
                if(scope.customer.status){
                    $interval.cancel(tickingQueuedTime);
                }
                element.on('$destroy', function() {
                    $interval.cancel(tickingQueuedTime);
                });

            }
        }
    }

})()
