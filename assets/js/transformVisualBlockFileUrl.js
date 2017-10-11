document.addEventListener("DOMContentLoaded", function() {
  var visualBlocks = document.getElementsByClassName("visual-block");

  for (var i=0; i<visualBlocks.length; ++i) {
    var newBlock = visualBlocks[i].innerHTML.replace(/src[a-zA-Z\.\/\-]*/g, function (match, p1) {
      return "<a href=\""
        + "https://github.com/vuejs/vue/blob/v2.4.4/"
        + match
        + "\" target=\"_blank\">"
        + match
        +"</a>"
    })

    visualBlocks[i].innerHTML = newBlock;
  }
});
