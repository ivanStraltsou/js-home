app.models.user = Backbone.Model.extend({

    // Defaults parameters
    defaults:function(){
      return{
          pid:Date.now() // Pseudo id - timestamp;
      };
    },

    // Validate
    validate:function(attrs){

        // Error object
        var objError={};

        var fillObjError =function(obj,key,rule){
            if(key in obj){
               obj[key].push(app.messages.errors[rule]);
            }else{
                obj[key]=[app.messages.errors[rule]];
            }
        };

        var check=function(rule,list){
            for(var i=0; i<list.length;i++){
                if(!app.helpers.validation[rule](attrs[list[i]])){
                    fillObjError(objError,list[i],rule);
                }
            }
        };

        var checkIsEmptyList=['name','age','email','info'],
            checkIsEmailList=['email'],
            checkIsNumeric=['age'],
            checkIsPositive=['age'];



        check('isNotEmpty',checkIsEmptyList);
        check('isValidEmail',checkIsEmailList);
        check('isNumeric',checkIsNumeric);
        check('isPositive',checkIsPositive);

        if(!_.isEmpty(objError)){
            return objError;
        }

    }

});
