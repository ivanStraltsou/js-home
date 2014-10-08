app.views.users=Backbone.View.extend({

    el:"#users-table",

    initialize:function(){

        var self=this;

        // Dom elements
        this.$tbody=this.$el.find('tbody');
        this.$sortTitleEl = this.$el.find('.sort-title');
        this.$selectPerPageEl=$('#user-records-per-page');
        this.$searchEl=$('#user-search');

        // Cell total
        var colspan=this.$el.find('.sort-title').length;

        // Empty search result element
        this.$emptySearchResult=$('<tr><td class="empty-cell" colspan="'+colspan+'" >'+app.messages.info.emptySearch+'</td></tr>');

        // Pagination
        this.paginationEl = $('#paginator');
        this.paginationItemTemplate=_.template($('#pagination-item').html());

        // Listen collection
        this.collection.on('add',this.renderOne,this);

        // Listen event Manager
        app.eventManager.on('clearRecords',this.clear,this);

        // Start params
        this.sortBy = app.settings.defaults.sortBy;
        this.sortType = app.settings.defaults.sortType;
        this.pageNum = app.settings.defaults.startPage;
        this.recordsPerPage = app.settings.defaults.recordsOnPage;
        this.searchStr = app.settings.defaults.searchStr;

        // Init
        this.initSelectPerPage();
        this.initSort();
        this.initPagination();
        this.initSearch();

        // Start show
        this.show();

    },

    initPagination:function(){

      var self = this;

      this.paginationEl.on('click','li a',function(event){

          event.preventDefault();
          var $el = $(this),
              $parentEl = $el.parent();
          var num = $el.attr('data-num');
          $parentEl.siblings().removeClass('active');
          $parentEl.addClass('active');
          self.setPagination(num);
          self.show();

      });
    },

    getPaginationTotalLinks:function(recordsTotal){
        var paginationLinkTotal = Math.ceil(recordsTotal/this.recordsPerPage);
        return paginationLinkTotal;
    },

    renderPagination:function(pageTotal,activePage){

        this.paginationEl.html('');

        for(var i=0; i<pageTotal;i++){
            this.paginationEl.append(this.paginationItemTemplate({num:i}));
        }

        this.paginationEl.children().eq(activePage-1).addClass('active');
    },

    setPagination:function(num){

      this.pageNum = num;

    },

    initSelectPerPage:function(){

        var self=this;

        for(var i=0; i<app.settings.recordsOnPage.length; i++){

            var $optionEl = $('<option>',{value:app.settings.recordsOnPage[i]}).text(app.settings.recordsOnPage[i]);
            this.$selectPerPageEl.append($optionEl);

        }

        this.$selectPerPageEl.on('change',function(){

            var recordPerPage = $(this).val();

            var newPageNum = Math.ceil(((self.pageNum-1)*self.recordsPerPage+1)/recordPerPage);
            self.pageNum = newPageNum;

            self.setRecordsPerPage(recordPerPage);
            self.show();

        });

    },

    setRecordsPerPage:function(total){

        this.recordsPerPage=total;
        this.$selectPerPageEl.find("[value='"+total+"']").attr("selected","selected");

    },

    initSort:function(){

        var self = this;

        self.setSort(this.sortBy,this.sortType);

        this.$sortTitleEl.on('click',function(){

            var $sortEl=$(this),
                sortType='desk',
                sortBy = $sortEl.attr('data-sort');

            if($sortEl.hasClass('desc')){

                $sortEl.removeClass('desc').addClass('asc');
                sortType='asc';
                self.pageNum=1;

            }else if($sortEl.hasClass('asc')){

                $sortEl.removeClass('asc').addClass('desc');
                sortType='desc';
                self.pageNum=1;

            }else{

                $sortEl.siblings().removeClass('desc').removeClass('asc');
                $sortEl.addClass('desc');
                sortType='desc';
                self.pageNum=1;

            }

            self.setSort(sortBy,sortType);
            self.show();

        });
    },

    setSort:function(sortBy,sortType){

        this.$sortTitleEl.removeClass('desc').removeClass('asc').filter('[data-sort="'+sortBy+'"]').addClass(sortType);
        this.sortBy = sortBy;
        this.sortType = sortType;

    },

    // Инициализация строки поиска
    initSearch:function(){

        var self=this;

        this.$searchEl.on('input',function(){

           var $el = $(this);
           var stext = $.trim($el.val().toLowerCase());
           self.searchStr=stext;
           self.pageNum=1;
           self.show();

        });

    },


    show:function(){

        this.clear();

        var sortBy = this.sortBy,
            sortType = this.sortType,
            recordsPerPage = this.recordsPerPage,
            pageNum = this.pageNum,
            searchStr = this.searchStr;

        var showParams={
            sortBy:sortBy,
            sortType:sortType,
            recordsPerPage:recordsPerPage,
            pageNum:pageNum,
            searchStr:searchStr
        };

        var filteredCollection = this.collection.show(showParams);

        if(filteredCollection.length===0){
            // Show empty search result
            this.$tbody.append(this.$emptySearchResult);
            this.paginationEl.html('');

        }else{

            if(showParams.searchStr){

            }else{

            }

            _.each(filteredCollection,this.renderOne,this);
            this.renderPagination(this.getPaginationTotalLinks(this.collection.currentTotal),this.pageNum);
        }

        app.eventManager.trigger('resetInputs');

    },

    renderOne:function(modelUser){
        var oneUserView = new app.views.user({model:modelUser});
            this.$tbody.append(oneUserView.render().el);
    },

    clear:function(){
      this.$tbody.html('');
    }
});