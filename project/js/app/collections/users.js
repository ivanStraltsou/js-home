app.collections.users = Backbone.Collection.extend({

   model: app.models.user,

   localStorage: new Backbone.LocalStorage('user-manager'),

   sortAttribute: app.settings.defaults.sortBy,

   sortDirection: app.settings.defaults.sortType,

   currentTotal:0,

   show:function(params){

       var foundModels=false,
           resultCollection;

       if(params.searchStr){
            foundModels = _.filter(this.models,function(model){
                return _.some(_.values(model.attributes),function(value){
                    return value.toString().toLowerCase().indexOf(params.searchStr)>=0;
                });
            });
       }

       if(foundModels){

           resultCollection = new app.collections.users(foundModels);
           this.currentTotal = resultCollection.length;

       }else{

           resultCollection = this;

       }

       this.currentTotal = resultCollection.length;

       resultCollection.sortUsers(params.sortBy,params.sortType);

        // Data for slice
        var startRecord = (params.pageNum-1)*params.recordsPerPage;
        var endRecord = startRecord+params.recordsPerPage*1;

       var filteredCollction=resultCollection.slice(startRecord,endRecord);

       return filteredCollction;
   },

   sortUsers:function(attr,direction){

       this.sortAttribute = attr;
       this.sortDirection = direction;

       this.sort();
   },
   comparator:function(modelA,modelB){

       var a = modelA.get(this.sortAttribute),
           b = modelB.get(this.sortAttribute);

       if(this.sortDirection=='asc'){
           return a > b ? 1 : -1;
       }else if(this.sortDirection=='desc') {
           return a < b ? 1 : -1;
       }

   }


});