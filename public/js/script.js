$( document ).ready(function() {

console.log("JEIHFLKJS");

//scraper button
$('#scraper').click(() => {
  console.log('CLICKED');
  $.ajax({
    method: 'GET',
    url: '/scrape'
  }).then(status => {
    console.log(status);
    window.location.reload();
  });
});

});

//function to add Note
shownote = event => {
  event.preventDefault();

  let id = $(this).attr('value');
  $("#addnote").fadeIn(100).css("display", "flex");
  $("#add-note").attr("value", id);
  $.get("/" + id, function(data) {
    $("#article-title").text(data.title);
    $.get("/note/"+ id, function(data){
      if (data){
        $("#note-title").val(data.title);
				$("#note-body").val(data.body);
      };
    });
  });
};

addnote = event => {
  event.preventDefault();
  let id = $(this).attr("value");
  let obj = {
    title: $("#note-title").val().trim(),
    body: $("#note-body").val().trim()
  };
  $.post("/note/" + id, obj, function(data){
    window.location.href = "/saved";
  });
};

change = () => {
  let status= $(this).attr("value");
  if(status === "Saved"){
    $(this).html("Unsave");
  }
};

changeback = () => {
  $(this).html($(this).attr("value"));
}
//add note button
$(".addnote-button").on("click", shownote);

//add note option displays and runs function
$("#add-note").on("click", addnote);

//hover to show save or unsave options
$(".status").hover(change, changeback);

//exit out of Note
$("#close-note").on("click", function(){
  $("#addnote").fadeOut(100);
});
