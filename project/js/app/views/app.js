app.views.appView=Backbone.View.extend({

    el:"#app",

    initialize:function(){

        // Save context
        var self=this;

        this.dataInputs={
            name:{},
            age:{},
            email:{},
            info:{}
        };

       // Dom elements
       for(var key in this.dataInputs){

           this.dataInputs[key].$el=$('#user-'+key);
           this.dataInputs[key].$elParent=this.dataInputs[key].$el.parent();
           // Init tooltip
           this.dataInputs[key].$el.tooltip({placement:"left",trigger:"manual"});

       }

       // User collection
       this.collection = new app.collections.users();
       this.collection.fetch();

       // Start current model
       this.currentUserModel = false;

       // Set start state
       this.showAddButtonHideEditDelete();

       // Test block
       $('#set-test-data').on('click',function(){

           app.eventManager.trigger('clearRecords');

           localStorage.clear();
		 
		   var fillData=function(i){
				return function(){
                    var model = new app.models.user(app.testData[i]);
                    self.collection.create(model);
                    if(i==testDataLength-1){
                        location.reload();
                    }
                  };
		   };
		 
           var timeout=0,
               testDataLength = app.testData.length;
           for(var i=0; i<testDataLength;i++){
              setTimeout(fillData(i) , timeout);
              timeout+=50;
           }
       });

        // Users collection initialization
        this.collectionView = new app.views.users({collection:this.collection});

        // Global events listen
        app.eventManager.on('selectItem',this.selectItem,this);
        app.eventManager.on('resetInputs',this.resetInputs,this);

    },

    events:{
        "click #add-button":"addUser",
        "click #edit-button":"editUser",
        "click #reset-button":"resetInputs",
        "click #delete-button":"deleteUser"
    },

    //
    showAddButtonHideEditDelete:function(){
      this.$el.find('#add-button').removeClass('hidden');
      this.$el.find('#edit-button').addClass('hidden');
      this.$el.find('#delete-button').addClass('hidden');
    },

    showEditDeleteButtonHideAdd:function(){
        this.$el.find('#edit-button').removeClass('hidden');
        this.$el.find('#delete-button').removeClass('hidden');
        this.$el.find('#add-button').addClass('hidden');
    },

    // Select Item
    selectItem:function(userModel){
        // Show edit button
        this.showEditDeleteButtonHideAdd();
        // Set default state
        this.setInputDefaultState();
        // Set model data
        this.setInputsData(userModel.attributes);
        // Set current user
        this.currentUserModel=userModel;
    },

    // Set Input data
    setInputsData:function(data){
        for(var key in this.dataInputs){
            this.dataInputs[key].$el.val(data[key]);
        }
    },

    // Get inputs data
    getInputsData:function(){
       var data={};
       for(var key in this.dataInputs){
           data[key]=this.dataInputs[key].$el.val();
       }
       return data;
    },

    clearInputs:function(){
        $.each(this.dataInputs,function(){
            this.$el.val('');
        });
    },

    // Set inputs style and tooltips
    setInputStyle:function(type,field,message){
      if(type=="error"){
        this.dataInputs[field].$elParent.removeClass('has-success').addClass('has-error');
        this.dataInputs[field].$el.attr('data-original-title',message);
        this.dataInputs[field].$el.tooltip('show');
      }else if(type=="success"){
        this.dataInputs[field].$elParent.removeClass('has-error').addClass('has-success');
        this.dataInputs[field].$el.attr('data-original-title','').tooltip('hide');
      }
    },

    setValidationState:function(errorObj){
        for(var k in this.dataInputs){
            if(errorObj && k in errorObj){
                this.setInputStyle('error',k,errorObj[k][0]);
            }else{
                this.setInputStyle('success',k);
            }
        }
    },

    // Inputs default state
    setInputDefaultState:function(){
        for(var key in this.dataInputs){
            this.dataInputs[key].$elParent.removeClass('has-error').removeClass('has-success');
            this.dataInputs[key].$el.attr('data-original-title',"").tooltip('hide');
        }
    },

    // Reset inputs
    resetInputs:function(){
        this.clearInputs();
        this.setInputDefaultState();
        app.eventManager.trigger('deselectItem');
        this.showAddButtonHideEditDelete();
        this.currentUserModel= false;
    },

    addUser:function(){

        // User data
        var data=this.getInputsData();

        if(this.currentUserModel){

            this.currentUserModel.set(data);

        }else{

            this.currentUserModel = new app.models.user(data);
        }

        if(this.currentUserModel.isValid()){

            this.collection.create(this.currentUserModel);
            this.resetInputs();

        }else{

            this.setValidationState(this.currentUserModel.validationError);

        }

    },

    editUser:function(){

        var data=this.getInputsData();
        this.currentUserModel.set(data);

        if(this.currentUserModel.isValid()){

            this.currentUserModel.save();
            this.resetInputs();

        }else{

            this.setValidationState(this.currentUserModel.validationError);

        }

    },

    deleteUser:function(){

        this.currentUserModel.destroy();
        this.resetInputs();

    }



});