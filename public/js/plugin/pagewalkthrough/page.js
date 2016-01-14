$(document).ready(function(){

	$('#walkthrough').pagewalkthrough({

		steps:
        [
               {
                   wrapper: '#article-explore-time',
                   margin: '0',
                   popup:
                   {
                       content: '#article-explore-time-tips',
                       type: 'tooltip',
                       position: 'bottom',
                       offsetHorizontal: 0,
                       offsetVertical: 0,
                       width: '280'
                   }     
               },
               {
                   wrapper: '#article-explore-tags',
                   margin: '0',
                   popup:
                   {
                       content: '#article-explore-tags-tips',
                       type: 'tooltip',
                       position: 'bottom',
                       offsetHorizontal: 0,
                       offsetVertical: 0,
                       width: '280'
                   }                
               },
               {
                   wrapper: '#article-explore-favorite',
                   margin: '0',
                   popup:
                   {
                       content: '#article-explore-favorite-tips',
                       type: 'tooltip',
                       position: 'left',
                       offsetHorizontal: 0,
                       offsetVertical: 0,
                       width: '280'
                   }                
               },
               {
                   wrapper: '#article-explore-dislike',
                   margin: '0',
                   popup:
                   {
                       content: '#article-explore-dislike-tips',
                       type: 'tooltip',
                       position: 'left',
                       offsetHorizontal: 0,
                       offsetVertical: 0,
                       width: '280'
                   }                
               },
               {
                   wrapper: '#article-explore-detail',
                   margin: '0',
                   popup:
                   {
                       content: '#article-explore-detail-tips',
                       type: 'tooltip',
                       position: 'left',
                       offsetHorizontal: 0,
                       offsetVertical: 0,
                       width: '280'
                   }                
               }

        ],
        name: 'Walkthrough',
        onLoad: true,
        onClose: function(){
            $('.main-menu ul li a#open-walkthrough').removeClass('active');
            return true;
        },
        onCookieLoad: function(){
            alert('This callback executed when onLoad cookie is FALSE');
            return true;
        }

	});

  	/***
   * NAVIGATION
   */

	$('.main-menu ul li a').each(function(){
      $('.main-menu ul li').find('a.active').removeClass('active');
      $(this).live('click', function(){
          $(this).addClass('active');
          var id = $(this).attr('id').split('-');

          if(id == 'parameters') return;

          $.pagewalkthrough('show', id[1]); 
      });
  });


  $('.prev-step').live('click', function(e){
      $.pagewalkthrough('prev',e);
  });

  $('.next-step').live('click', function(e){
      $.pagewalkthrough('next',e);
  });

  $('.restart-step').live('click', function(e){
      $.pagewalkthrough('restart',e);
  });

  $('.close-step').live('click', function(e){
      $.pagewalkthrough('close');
  });

});