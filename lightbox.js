$(document).ready(function() {
  const $lightboxMask = $("#lightbox_mask");
  const $lightbox = $("#lightbox");
  const $closeButton = $("#close-button");
  const $images = $(".box-image img");
  const $previous = $("#prev-button");
  const $next = $("#next-button");
  const $imgAlt = $(this).attr("alt");

  let currentIndex;

  $images.on("click", function() {
    const scrollPos = $(window).scrollTop();
    $lightboxMask.fadeIn(300);
    $lightbox.fadeIn(300).addClass("active").css("top", scrollPos + 50);

    const imgSrc = $(this).attr("src");
    const imgAlt = $(this).attr("alt");
    const $img = $lightbox.find("img");

    $img.attr("src", imgSrc);
    $img.attr("alt", imgAlt);

    currentIndex = $images.index($(this));
    updateAltText(imgAlt);
    endButtons();
  });

  function updateAltText(imgAlt) {
    let $altText = $lightbox.find(".alt-text");
    if (!$altText.length) {
      $altText = $("<div>").addClass("alt-text");
      $lightbox.append($altText);
    }
    $altText.text(imgAlt);
  }

  $closeButton.on("click", function() {
    closeLightbox();
  });

  $lightboxMask.on("click", function(event) {
    if (event.target === this) {
      closeLightbox();
    }
  });
  $lightbox.add($lightboxMask).css("display", "none");

  $previous.on("click", prevImage);
  $next.on("click", nextImage);
  function updateImage() {
    const newSource = $images.eq(currentIndex).attr("src");
    const $img = $lightbox.find("img");
    
    $img.fadeOut(300, function() {
      $img.attr("src", newSource).fadeIn(300);
      $img.css("transform", "translateX(0)"); // Reset the translateX after the animation
      updateAltText($images.eq(currentIndex).attr("alt"));
      endButtons();
    });
  }
  
  function nextImage() {
    currentIndex++;
    if (currentIndex >= $images.length - 1) {
      currentIndex = $images.length - 1;
    }
    updateImage();
  }

  function prevImage() {
    currentIndex--;
    if (currentIndex <= 0) {
      currentIndex = 0;
    }
    updateImage();
  }

  function endButtons() {
    $previous.css("display", "flex");
    $next.css("display", "flex");

    if (currentIndex === 0) {
      $previous.css("display", "none");
    }
    if (currentIndex === $images.length - 1) {
      $next.css("display", "none");
    }
  }

  function closeLightbox() {
    $lightbox.removeClass("active").hide();
    $lightboxMask.fadeOut(300);
    $lightbox.find(".alt-text").fadeOut(300, function() {
      $(this).remove(); 
    });
    $lightbox.find("img").css("opacity", ""); 
  }


  
  let touchStartX = 0;
  let touchEndX = 0;

  $lightbox.on('touchstart', function(e) {
    touchStartX = e.changedTouches[0].clientX;
  });

  $lightbox.on('touchend', function(e) {
    touchEndX = e.changedTouches[0].clientX;
    handleGesture();
  });
  function handleGesture() {
    const $img = $lightbox.find("img");
    if (touchEndX < touchStartX) {
      currentIndex++;
      if (currentIndex >= $images.length - 1) {
        currentIndex = $images.length - 1;
      }
      $img.css("transform", "translateX(100vw)");
      updateImage();
    } else if (touchEndX > touchStartX) {
      currentIndex--;
      if (currentIndex <= 0) {
        currentIndex = 0;
      }
      $img.css("transform", "translateX(-100vw)");
      updateImage();
    }
  }
  $lightbox.on('touchmove', function(e) {
    e.preventDefault();
  });
});

