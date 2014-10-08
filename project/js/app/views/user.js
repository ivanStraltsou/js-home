app.views.user=Backbone.View.extend({

    tagName:"tr",

    template: _.template($('#user-record').html()),

    initialize:function(){

        this.listenTo(this.model,'destroy',this.remove);
        this.listenTo(this.model,'sync',this.render);

        app.eventManager.on('deselectItem',this.deselectItem,this);

    },

    events:{
        "click":"selectItem"
    },

    selectItem:function(){

        this.$el.addClass('active');
        this.$el.siblings().removeClass('active');

        app.eventManager.trigger('selectItem',this.model);

    },

    deselectItem:function(){

      this.$el.removeClass('active');

    },

    render:function(){

        this.$el.html(this.template(this.model.toJSON()));
        return this;

    }
});