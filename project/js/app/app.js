app={
    models:{},
    views:{},
    collections:{},
    settings:{
        recordsOnPage:[5,10,25,50,100],
        defaults:{
            recordsOnPage:5,
            sortType:'asc',
            sortBy:'name',
            startPage:1,
            searchStr:"" // Start search value
        }
    },
    eventManager: _.extend({},Backbone.Events),
    helpers:{
        validation:{
            isNotEmpty:function(dataString){
                if(dataString.length === 0){
                    return false;
                }
                return true;
            },
            isValidEmail:function(email){
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            isNumeric:function(n){
                return !isNaN(parseFloat(n)) && isFinite(n);
            },
            isPositive:function(n){
                return n>0;
            }
        }
    },
    messages:{
        errors:{
            isNotEmpty:" Must not be empty ",
            isValidEmail: " Email is not valid",
            isNumeric:" Must be a number ",
            isPositive:"Must be positive "
        },
        info:{
            emptySearch:"No matching records found"
        }

    }
};