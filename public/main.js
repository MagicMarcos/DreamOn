var likeBtn = document.getElementsByClassName('likeBtn');
var trash = document.getElementsByClassName('fa-trash');

Array.from(likeBtn).forEach(function (element) {
  element.addEventListener('click', function () {
    console.log(this.parentNode.childNodes[1].childNodes[1]);
    const likedPostId = this.parentNode.childNodes[1].childNodes[1].dataset.id;
    const totalLikes = this.parentNode.childNodes[1].childNodes[1].innerText;
    console.log(totalLikes);
    fetch('likePost', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        likedPostId: likedPostId,
        totalLikes: totalLikes,
      }),
    })
      .then(response => {
        if (response.ok) return response.json();
      })
      .then(data => {
        console.log(data);
        window.location.reload();
      });
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText;
    const msg = this.parentNode.parentNode.childNodes[3].innerText;
    fetch('messages', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        msg: msg,
      }),
    }).then(function (response) {
      // window.location.reload();
    });
  });
});

var acc = document.getElementsByClassName('accordion');
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', function () {
    this.classList.toggle('active');
    var panel = this.nextElementSibling;
    if (panel.style.height) {
      panel.style.height = null;
    } else {
      console.log(panel.scrollHeight);
      panel.style.height = 'fit-content';
    }
  });
}
