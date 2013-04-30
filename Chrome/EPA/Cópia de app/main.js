/*var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://www.areah.com.br/images/fotos/mh_home_capa_detroicelectric.jpg', true);
xhr.responseType = 'blob';

xhr.onload = function(e) {
  var img = document.createElement('img');
  img.src = window.webkitURL.createObjectURL(this.response);
  document.body.appendChild(img);
};

xhr.send();
*/

chrome.app.window.current().fullscreen();