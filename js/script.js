//ページが読み込まれたら実行させる
$(function () {
  // ID="nobi-box"の要素がクリックされたら実行
  $("#nobi-box").click(function () {
    $("#nobi-box").animate({ width: "100%" }, 5000);
  });
});
