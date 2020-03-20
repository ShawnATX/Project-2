
// Add event listeners to the submit and delete buttons

// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");
var $uploadImg = $("#imgUpload");

// The API object contains methods for each kind of request we'll make
var API = {
  startUpload: function(form) {
    console.log(form);
    $.ajax({
      "async": true,
      "crossDomain": true,
      "url": "/api/uploads",
      "type": "POST",
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "713a4d67-e756-42f9-8214-179c033bad45"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    })
    .then(function(res) {
      console.log(res);
      })
      .catch(function(err) {
        console.log(err);
      });
    }
};

var handleUpload = function(event) {
  console.log("Handling upload");
  var file = event.target.files[0];
  console.log(file);
  console.log(event.target);
  console.log(event.target.files);
  var formData = new FormData();
  formData.append("photo", file);
  console.log(formData);
  API.startUpload(formData);
};
// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
      .text(example.text)
      .attr("href", "/example/" + example.id);
      
      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);
        
        var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");
        
        $li.append($button);
        
        return $li;
      });
      
    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();
  
  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };
  
  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }
  
  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
  .parent()
  .attr("data-id");
  
  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$uploadImg.on("change", handleUpload);
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);