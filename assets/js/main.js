const EMAIL_SEND_LIMIT_HOURS = 1;

const config = {
  title_config: "Oli Group",
  address_config: "Hlavná 14,<br>080 01 Prešov,<br>Slovensko",
  phone_config: "+421 904 529 748",
  email_config: "doprava@oligroup.sk"
};

function initializeElements() {
  for (let key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      let elements = document.querySelectorAll(`.${key}`);
      elements.forEach(element => {
        if(key === "email_config" && element.tagName === "A"){
          element.href = `mailto:${config[key]}`;
        }
        if(key === "phone_config" && element.tagName === "A"){
          element.href = `tel:${config[key].replaceAll(" ", "")}`;
        }
        element.innerHTML = config[key];
      })
    }
  }
}

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      initializeElements();

      preloader.remove();
    });
  }

  /**
   * Sticky header on scroll
   */
  waitForElm("#header").then((element)=>{
    if (element) {
      document.addEventListener('scroll', () => {
        window.scrollY > 100 ? element.classList.add('sticked') : element.classList.remove('sticked');
      });
    }
  })

  /**
   * Scroll top button
   */
  waitForElm(".scroll-top").then((element)=>{
    const togglescrollTop = function() {
      window.scrollY > 100 ? element.classList.add('active') : element.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    element.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  })

  document.querySelectorAll('input[required]').forEach(function(input) {
    input.addEventListener('invalid', function() {
      this.setCustomValidity(this.getAttribute("data-required-message"));
    });

    input.addEventListener('input', function() {
      this.setCustomValidity('');
    });
  });

  document.getElementById('contact-form')?.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting

    let lastEmailTime = localStorage.getItem('lastEmailTime');
    let currentTime = new Date().getTime(); // Get current time in milliseconds

    if (lastEmailTime && (currentTime - parseInt(lastEmailTime, 10) < (EMAIL_SEND_LIMIT_HOURS*1000*60*60))) {
      alert('Je možné odoslať len 1 email za '+ EMAIL_SEND_LIMIT_HOURS +(EMAIL_SEND_LIMIT_HOURS === 1 ? 'hodinu' : EMAIL_SEND_LIMIT_HOURS < 5 ? 'hodiny' : 'hodín'));
    } else {
      localStorage.setItem('lastEmailTime', currentTime.toString());
      event.target.submit();
    }
  });

  /**
   * Mobile nav toggle
   */
  waitForElm("#navbar").then((element)=>{
    const mobileNavShow = document.querySelector('.mobile-nav-show');
    const mobileNavHide = document.querySelector('.mobile-nav-hide');

    document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
      el.addEventListener('click', function(event) {
        event.preventDefault();
        mobileNavToogle();
      })
    });

    function mobileNavToogle() {
      document.querySelector('body').classList.toggle('mobile-nav-active');
      mobileNavShow.classList.toggle('d-none');
      mobileNavHide.classList.toggle('d-none');
    }

    element.addEventListener('click', (event)=> {
      if(event.target.nodeName !== "UL" && event.target.nodeName !== "A")
        mobileNavToogle();
    })
  })

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navbar a').forEach(navbarlink => {

    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach(el => {
    el.addEventListener('click', function(event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    })
  });

  /**
   * Initiate pURE cOUNTER
   */
  new PureCounter();

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  new Swiper('.slides-1', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

});