/* js/custom.js */
(function () {
  "use strict";

  // Respect users who prefer reduced motion
  var PREFERS_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- AOS (guard against double init) ----
  if (window.AOS && !document.documentElement.hasAttribute("data-aos-initialized")) {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 100
    });
    document.documentElement.setAttribute("data-aos-initialized", "");
  }
  window.addEventListener("load", function () {
    if (window.AOS) AOS.refresh();
  });

  // ---- Your existing jQuery logic (kept), with a few safe tweaks ----
  $(function () {
    // Loader
    $(".loader").delay(200).fadeOut("slow");
    $("#overlayer").delay(200).fadeOut("slow");

    // Clone desktop nav into mobile menu
    var siteMenuClone = function () {
      $(".js-clone-nav").each(function () {
        var $this = $(this);
        $this.clone().attr("class", "site-nav-wrap").appendTo(".site-mobile-menu-body");
      });

      setTimeout(function () {
        var counter = 0;
        $(".site-mobile-menu .has-children").each(function () {
          var $this = $(this);

          $this.prepend('<span class="arrow-collapse collapsed">');

          $this.find(".arrow-collapse").attr({
            "data-toggle": "collapse",
            "data-target": "#collapseItem" + counter
          });

          $this.find("> ul").attr({
            class: "collapse",
            id: "collapseItem" + counter
          });

          counter++;
        });
      }, 1000);

      $("body").on("click", ".arrow-collapse", function (e) {
        var $this = $(this);
        if ($this.closest("li").find(".collapse").hasClass("show")) {
          $this.removeClass("active");
        } else {
          $this.addClass("active");
        }
        e.preventDefault();
      });

      $(window).on("resize", function () {
        var w = $(this).width();
        if (w > 768 && $("body").hasClass("offcanvas-menu")) {
          $("body").removeClass("offcanvas-menu");
          $("body").find(".js-menu-toggle").removeClass("active");
        }
      });

      $("body").on("click", ".js-menu-toggle", function (e) {
        e.preventDefault();
        if ($("body").hasClass("offcanvas-menu")) {
          $("body").removeClass("offcanvas-menu");
          $("body").find(".js-menu-toggle").removeClass("active");
        } else {
          $("body").addClass("offcanvas-menu");
          $("body").find(".js-menu-toggle").addClass("active");
        }
      });

      // click outside to close offcanvas
      $(document).on("mouseup", function (e) {
        var container = $(".site-mobile-menu");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          if ($("body").hasClass("offcanvas-menu")) {
            $("body").removeClass("offcanvas-menu");
            $("body").find(".js-menu-toggle").removeClass("active");
          }
        }
      });
    };
    siteMenuClone();

    // Owl Carousels (respect reduced motion)
    var autoplayFlag = !PREFERS_REDUCED_MOTION;

    var owlPlugin = function () {
      if ($(".owl-3-slider").length > 0) {
        $(".owl-3-slider").owlCarousel({
          loop: true,
          autoHeight: true,
          margin: 10,
          autoplay: autoplayFlag,
          smartSpeed: 700,
          items: 1,
          nav: true,
          dots: true,
          navText: [
            '<span class="icon-keyboard_backspace"></span>',
            '<span class="icon-keyboard_backspace"></span>'
          ],
          responsive: {
            0: { items: 1 },
            600: { items: 1 },
            800: { items: 2 },
            1000: { items: 2 },
            1100: { items: 3 }
          }
        });
      }

      if ($(".owl-4-slider").length > 0) {
        var owl4 = $(".owl-4-slider").owlCarousel({
          loop: true,
          autoHeight: true,
          margin: 10,
          autoplay: autoplayFlag,
          smartSpeed: 700,
          items: 4,
          nav: true,
          dots: true,
          navText: [
            '<span class="icon-keyboard_backspace"></span>',
            '<span class="icon-keyboard_backspace"></span>'
          ],
          responsive: {
            0: { items: 1 },
            600: { items: 2 },
            800: { items: 2 },
            1000: { items: 3 },
            1100: { items: 4 }
          }
        });

        $(".js-custom-next-v2").on("click", function (e) {
          e.preventDefault();
          owl4.trigger("next.owl.carousel");
        });
        $(".js-custom-prev-v2").on("click", function (e) {
          e.preventDefault();
          owl4.trigger("prev.owl.carousel");
        });
      }

      if ($(".owl-single-text").length > 0) {
        $(".owl-single-text").owlCarousel({
          loop: true,
          autoHeight: true,
          margin: 0,
          autoplay: autoplayFlag,
          smartSpeed: 1200,
          items: 1,
          nav: false,
          navText: [
            '<span class="icon-keyboard_backspace"></span>',
            '<span class="icon-keyboard_backspace"></span>'
          ]
        });
      }

      if ($(".owl-single").length > 0) {
        var owl = $(".owl-single").owlCarousel({
          loop: true,
          autoHeight: true,
          margin: 0,
          autoplay: autoplayFlag,
          smartSpeed: 800,
          items: 1,
          nav: false,
          navText: [
            '<span class="icon-keyboard_backspace"></span>',
            '<span class="icon-keyboard_backspace"></span>'
          ],
          onInitialized: counter
        });

        function counter(event) {
          $(".owl-total").text(event.item.count);
        }

        $(".js-custom-owl-next").on("click", function (e) {
          e.preventDefault();
          owl.trigger("next.owl.carousel");
          $(".owl-single-text").trigger("next.owl.carousel");
        });
        $(".js-custom-owl-prev").on("click", function (e) {
          e.preventDefault();
          owl.trigger("prev.owl.carousel");
          $(".owl-single-text").trigger("prev.owl.carousel");
        });

        $(".owl-dots .owl-dot").each(function (i) {
          $(this).attr("data-index", i - 3);
        });

        owl.on("changed.owl.carousel", function (event) {
          var i = event.item.index;
          if (i === 1) {
            i = event.item.count;
          } else {
            i = i - 1;
          }
          $(".owl-current").text(i);
          $(".owl-total").text(event.item.count);
        });
      }
    };
    owlPlugin();

    // Animated counters
    var counterWaypoints = function () {
      $(".count-numbers").waypoint(function (direction) {
        if (direction === "down" && !$(this.element).hasClass("ut-animated")) {
          var stepper = $.animateNumber.numberStepFactories.separator(",");
          $(".counter > span").each(function () {
            var $this = $(this),
              num = $this.data("number");
            $this.animateNumber({ number: num, numberStep: stepper }, 7000);
          });
          $(this.element).addClass("ut-animated");
        }
      }, { offset: "95%" });
    };
    counterWaypoints();

    // Date range picker (if present)
    if ($('input[name="daterange"]').length) {
      $('input[name="daterange"]').daterangepicker();
    }
  });

  // ---- Classy tilt-on-hover for description cards (.feature-1) ----
  // Targets the inner content to avoid fighting AOS transforms.
  (function tiltCards() {
    var allowHover =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches && !PREFERS_REDUCED_MOTION;
    if (!allowHover) return;

    var cards = document.querySelectorAll(".feature-1");
    var MAX_TILT = 8; // degrees
    var ANIM_MS = 120;

    cards.forEach(function (card) {
      var target = card.querySelector(".align-self-center") || card;
      var ticking = false;

      function onMove(e) {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(function () {
          var rect = target.getBoundingClientRect();
          var relX = (e.clientX - rect.left) / rect.width;
          var relY = (e.clientY - rect.top) / rect.height;
          relX = Math.max(0, Math.min(1, relX));
          relY = Math.max(0, Math.min(1, relY));

          var rotY = (relX - 0.5) * (MAX_TILT * 2);
          var rotX = (0.5 - relY) * (MAX_TILT * 2);

          target.style.transition = "transform " + ANIM_MS + "ms ease";
          target.style.transform =
            "perspective(800px) rotateX(" + rotX.toFixed(2) + "deg) rotateY(" + rotY.toFixed(2) + "deg) translateZ(0)";
          ticking = false;
        });
      }

      function onLeave() {
        target.style.transition = "transform " + ANIM_MS + "ms ease";
        target.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateZ(0)";
      }

      function onEnter() {
        target.style.transition = "transform " + ANIM_MS + "ms ease";
      }

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });
  })();
})();
