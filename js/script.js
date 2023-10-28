var aElement = document.getElementById("a");
aElement.style.display = "none"; // #aの要素を非表示にする
var aElement = document.getElementById("c");
aElement.style.display = "none"; // #aの要素を非表示にする
var h_name = document.getElementById("home_name"); //名前取得
var flag = 1;
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("leftbutton").addEventListener("click", function () {
    // a以外の全ての要素を非表示にする
    if (flag > 0 && flag <= 2) {
      flag -= 1;
    }
    if (flag == 0) {
      h_name.textContent = "8 vertex form";
    } else if (flag == 1) {
      h_name.textContent = "intermediate";
    } else {
      h_name.textContent = "6 vertex form";
    }
    var elements = document.getElementsByClassName("element");
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].id !== elements[flag].id) {
        elements[i].style.display = "none";
      } else {
        elements[i].style.display = "grid";
        elements[i].style.opacity = "0";
        fadeIn(elements[i]); // フェードイン関数を呼び出す
      }
    }
    console.log(flag);
  });
});
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("rightbutton").addEventListener("click", function () {
    // a以外の全ての要素を非表示にする
    if (flag >= 0 && flag < 2) {
      flag += 1;
    }
    if (flag == 0) {
      h_name.textContent = "8 vertex form";
    } else if (flag == 1) {
      h_name.textContent = "intermediate";
    } else {
      h_name.textContent = "6 vertex form";
    }
    var elements = document.getElementsByClassName("element");
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].id !== elements[flag].id) {
        elements[i].style.display = "none";
      } else {
        elements[i].style.display = "grid";
        elements[i].style.opacity = "0";
        fadeIn(elements[i]); // フェードイン関数を呼び出す
      }
    }
    console.log(flag);
  });
});
function fadeIn(element) {
  var opacity = 0;
  var timer = setInterval(function () {
    if (opacity >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = opacity;
    opacity += 0.1; // フェードインの速さを調整できます
  }, 50); // フェードインの速さを調整できます
}
