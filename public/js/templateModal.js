window.templateModal = 
    '<div class="modal-content-container">' +
        '<div class="cross-close close"><span class="glyphicon glyphicon-remove icon"></span></div>' +
        '<div class="image-container">' +
           '<a target="_blank" href="<%= imageHref %>">' +
            '<img src="<%= imageSrc %>">' +
           '</a>' +
        '</div>' +
        '<div class="sub-image-content">' +
            '<div class="likes"><span class="glyphicon glyphicon-heart-empty icon"></span><%= numberLikes %></div>' +
            '<div class="comments"><span class="glyphicon glyphicon-comment icon"></span><%= numberComments %></div>' +
        '</div>'+
    '</div>';
  