

function submitForm(e){
  e.preventDefault();

  var email = $('.form .email').val();

  $.post('/api/v1/user/requestaccess', { email: email })
    .then(function(response){
      $('.confirm').removeClass('hide');
      $('.confirm').addClass('animated fadeIn');
    })
    .fail(function(err){
      console.log(err);
      $('.form .email').addClass('error');
      $('.error-message').removeClass('hide').addClass('animated fadeIn');
    });
}

function resetMessages(){
  $('.error-message').addClass('hide').removeClass('animated fadeIn');
  $('.confirm').addClass('hide').removeClass('animated fadeIn');

  if($('.form .email').val().length > 0){
    $('#signup-button').attr('disabled', false);
  }else{
    $('#signup-button').attr('disabled', 'disabled');
  }
}

function initMenu(){
  $('.page-scroll a').on('click', function(e){
    e.preventDefault();
    var target = $('#'+ $(e.currentTarget).attr('href').replace('/#', ''));
     $('html,body').animate({
        scrollTop: target.offset().top - 50
      }, 500);
  })
}

function initBindings(){
  $('#signup-button').on('click', submitForm);
  $('.email').on('keyup', resetMessages);
  initMenu();
}

$(document).ready(initBindings);