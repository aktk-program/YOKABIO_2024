var link = document.getElementById("myLink");

// 要素がクリックされたときにリンク先に遷移
link.addEventListener("click", function () {
  window.location.href = link.href;
});
