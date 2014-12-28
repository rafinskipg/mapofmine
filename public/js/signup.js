

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

function initBindings(){
  $('#signup').on('click', submitForm);
  $('.email').on('keyup', resetMessages);
}

function resetMessages(){
  $('.error-message').addClass('hide').removeClass('animated fadeIn');
  $('.confirm').addClass('hide').removeClass('animated fadeIn');

  if($('.form .email').val().length > 0){
    $('#signup').attr('disabled', false);
  }else{
    $('#signup').attr('disabled', 'disabled');
  }
}

$(document).ready(initBindings);