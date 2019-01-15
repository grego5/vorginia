(function(){

const galleries = {
   design: {
      layout: 'grid-layout',
      isMenu: false,
      isLoaded: false,
      images: design
   },

   photography: {
      isMenu: true,
      layout: 'flex-layout',
      isLoaded: false,
      images: [
         {
            url: 'photoshop',
            text: 'photoshop'
         },
         {
            url: 'berneseMountainDog',
            text: 'bernese mountain dog'
         },
         {
            url: 'people',
            text: 'people'
         }
      ]
   },

   photoshop: {
      isMenu: false,
      isLoaded: false,
      layout: 'grid-layout',
      images: photoshop
   },

   berneseMountainDog: {
      layout: 'grid-layout',
      isMenu: false,
      isLoaded: false,
      images: berneseMountainDog
   },

   people: {
      layout: 'grid-layout',
      isMenu: false,
      isLoaded: false,
      images: people
   }
}

const displays = function() {
   const d = document.getElementsByTagName('main');
   const res = {}
   for (let i=0; i<d.length; i++){
      const elem = d[i];
      res[elem.id] = d[i];
   }
   return res;
}();

let inMotion = false;
const header = document.getElementsByTagName('header')[0];
const title = document.title;
const navLinks = document.getElementsByClassName('nav-link');
for (let i=0; i<navLinks.length; i++){
   navLinks[i].addEventListener('click', changeDisplay);
}

const mail = function(){
   const feed   = document.getElementById('feed');
   const defaultText = feed.innerText;
   feed.addEventListener('animationend', function(){
      feed.classList.remove('flicker');
   })

   return obj = {
      inMotion: false,
      send(){
         if (!validateEmail(email.value)) {
            feed.innerText = 'Invalid Email'
            feed.classList.add('flicker');
            return;
         }

         this.inMotion = true;
         contact.classList.add("sent");

         const xhttp = new XMLHttpRequest();
         xhttp.onreadystatechange = function() {
            // console.log(`state: ${this.readyState} status: ${this.status}`);
            if (this.readyState == 4 && this.status == 200) {
               console.log(this.responseText);
               feed.innerText = 'The message has been sent. Thank you.'
               feed.classList.add('flicker');
            }
         };
         xhttp.open("POST", "/message", true);
         xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
         xhttp.send(`email=${email.value}&message=${msg.innerHTML}`);
      },
      reset(){
         this.inMotion = false;
         contact.classList.remove('sent'); // reset the contact mail animation
         feed.innerText = defaultText;
      }
   }
}();
sendLetter.addEventListener("click", mail.send.bind(mail));

function Gallery(id) {
   this.display = document.getElementById(id);
   this.gallery = this.display.getElementsByClassName('gallery')[0];
   this.cards = this.gallery.getElementsByClassName('gallery-img');
   this.currImg = 0;
   this.x0 = null; 
}

Gallery.prototype = {
   hidden: document.getElementsByClassName('modal-hide'), // look for elements to hide when modal open
   modal: document.getElementById('modal'),
   modalContent: this.modal.getElementsByClassName('modal-content')[0],
   nextImg: this.modal.getElementsByClassName('modal-next')[0],
   prevImg: this.modal.getElementsByClassName('modal-prev')[0],

   init() {
      for (let i=0; i<this.cards.length; i++) this.cards[i].addEventListener('click', function(){
         this.open(i) }.bind(this));
      
      this.modal.addEventListener('click', this.click.bind(this));
      this.modal.addEventListener('wheel', this.wheel.bind(this), {passive: true});
      this.modal.addEventListener('touchstart', this.lock.bind(this), {passive: true});
      this.modal.addEventListener('touchend', this.move.bind(this));
   },
   changeModalImage(i){
      if (this.display.classList.contains('active-display')) {
         this.currImg = i < 0 ? this.cards.length-1 : i > this.cards.length-1 ? 0 : i; // loop image list
         const thumbnail = this.cards[this.currImg].getElementsByClassName('thumbnail')[0];
         const img = thumbnail.getAttribute('style');
         this.modalContent.setAttribute('style', img);
      }
   },
   open(i){
      if (!inMotion) {
         this.changeModalImage(i);
         header.classList.add('hide');
         document.body.classList.add('modal-open');
         this.modal.style.display = "flex";
         this.modalContent.style.animation = 'grow 0.2s ease-out';
         this.modalContent.addEventListener('animationend', function(){
            this.modal.style.animation = '';
         }.bind(this));
      }
   },
   close(){
      this.modal.style.display = "none";
      header.classList.remove('hide');
      document.body.classList.remove('modal-open');
   },
   wheel(e){ 
      e.wheelDeltaY>0 ? this.changeModalImage(this.currImg+1) : this.changeModalImage(this.currImg-1)
   },

   click(e){
      switch(e.target) {
         case this.nextImg: this.changeModalImage(this.currImg+1); break;
         case this.prevImg: this.changeModalImage(this.currImg-1); break;
         default: this.close();
      }
   },
   lock(e) { this.x0 = this.touch(e).clientX },
   move(e) {
      if(this.x0 || this.x0 === 0) {
         let dx = this.x0 - this.touch(e).clientX, s = Math.sign(dx);
         if (Math.abs(dx) > 50 ) this.changeModalImage(this.currImg + s);
         this.x0 = null
      }
   },
   touch(e) { return e.changedTouches ? e.changedTouches[0] : e },

   constructor: Gallery,
}

window.onpopstate = function (e) {
   if (document.body.classList.contains('modal-open')) {
      Gallery.prototype.close();
   }
   if (history.state && history.state.url) loadDisplay(history.state.url);
};

loadDisplay(window.location.pathname, function(url){
   history.replaceState({url:url}, '', url);
});


function changeDisplay(e){
   e.preventDefault();
   toTop();
   loadDisplay(this.pathname, function(url){
      window.history.pushState({url:url}, '', url);
   });
}

function loadDisplay(p, cb){
   const path = p.split('/');
   let id = path[path.length-1]; // get the page id
   if (!displays[id]) id = 'home'; // find the requested page, set to home if not found
   
   if (['home', 'contact'].indexOf(id) > -1) header.classList.remove('collapse'); // toggle the widescreen menu collapse
   else header.classList.add('collapse'); // on all pages except home and contact

   if (mail.inMotion) mail.reset();

   document.title = `${title} - ${id[0].toUpperCase() + id.substr(1)}` // update the document title to be the page id

   let current = document.getElementsByClassName('active-display')[0]; // get the current active display
   if (!inMotion && (!current || current.id !== id)){ // check that it's not in a middle of animation, and the requested route isn't current
      if (cb) cb(p);
   
      if (galleries[id] && !galleries[id].isLoaded) {
         const gallery = displays[id].getElementsByClassName('gallery')[0];
         loadImages(id, gallery);
         if (galleries[id].obj) {
            galleries[id].obj.init();
         }
         galleries[id].isLoaded = true;
      }

      displays[id].classList.add('active-display');

      if (current) {
         inMotion = true;
         displays[id].classList.add('infront');
         current.style.animation = 'fadeout 0.5s';
         current.addEventListener('animationend', function(e){
            if(e.target.classList.contains('active-display')) {
               current.style.animation = '';
               displays[id].classList.remove('infront');
               if (current) current.classList.remove('active-display');
               inMotion = false;
            };
         });
      }
   } 
}

function loadImages(id, gallery){
   const data = galleries[id];
   for (let img of data.images){
      const container = document.createElement('div');
      let thumbnail;
      
      if (data.isMenu) {
         container.classList.add('gallery-nav');
         const _images = galleries[img.url].images;
         const n = Math.floor(Math.random() * _images.length);
         thumbnail = htmlToElement(`<div class="thumbnail" style="background-image: url(${_images[n].url});">
            <i class="material-icons">remove_red_eye</i>
            <div class="caption"><h4>${img.text}</h4></div>
         </div>)`);
         const a = htmlToElement(`<a class="nav-link" href="/${id}/${img.url}"></a>`);         
         a.addEventListener('click', changeDisplay);
         container.append(a);
      } else {
         container.classList.add('gallery-img');
         container.setAttribute('style', `--v:${img.v}; --h:${img.h}`)
         if (img.v > img.h) container.classList.add('vertical');
         thumbnail = htmlToElement(`<div class="thumbnail" style="background-image: url(${img.url});">
         ${img.text.length ? `<div class="caption"><h4>${img.text}<h4></div>` : ``}</div>)`);
         if (img.url2) {
            const layer = htmlToElement(`<div class="layer" style="background-image: url(${img.url2});"></div>)`);
            container.append(layer);
         }
      }
      container.append(thumbnail);
      gallery.classList.add(data.layout);
      gallery.append(container);
   }
   galleries[id].obj = (!data.isMenu) ? new Gallery(id) : false;
}

const resizeTA = function() {
   const txta = document.getElementsByTagName('textarea')[0];
   let isWide = false;
   txta.innerText = `Under construction. You can just click send to check the animation. It doesn't actually sending yet.`;

   return function(){
      let w = window.innerWidth; // viewport width
      if (w >= 600 && !isWide) {
         isWide = true;
         txta.rows = 16;
      } else if (w < 600 && isWide){
         isWide = false;
         txta.rows = 10;
      }
   }
}();
resizeTA();
window.addEventListener("resize", resizeTA);

function htmlToElement(html) {
   var template = document.createElement('template');
   html = html.trim(); // Never return a text node of whitespace as the result
   template.innerHTML = html;
   return template.content.firstChild;
}

document.addEventListener('scroll', function(){
   let threshold = header.offsetHeight;
   if (window.pageYOffset > threshold){
      header.classList.add('slide-hide');
   } else {
      header.classList.remove('slide-hide');
   }
})

document.addEventListener('click', function(e){
   const t = e.target;
   if (t.nodeName === 'HEADER' || t.className === 'nav-link') {
      closeMenu();
   }
})

burger.addEventListener('click', function(e){
   e.stopPropagation();
   header.classList.toggle('active');
   document.body.classList.toggle('modal-open');
})

function closeMenu(){
   header.classList.remove('active');
   document.body.classList.remove('modal-open');
}

function toTop() {
   document.body.scrollTop = 0; // For Safari
   document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
 }

 function validateEmail(email) {
   var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(String(email).toLowerCase());
}

})();