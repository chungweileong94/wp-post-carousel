if (process.env.NODE_ENV === 'development') {
  script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'http://localhost:35729/livereload.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}

const $itemsContainer = document.querySelector('.wr__post-items');
const $items = $itemsContainer.getElementsByClassName('wr__post-item');
const itemLength = $items.length;

// Clone first and last item
const $firstItem = $items[0];
const $lastItem = $items[itemLength - 1];
const $cloneFirstItem = $firstItem.cloneNode(true);
const $cloneLastItem = $lastItem.cloneNode(true);
$itemsContainer.appendChild($cloneFirstItem);
$itemsContainer.insertBefore($cloneLastItem, $firstItem);

let posInitial = 0;
let posFinal = 0;
let posX1 = 0;
let posX2 = 0;
let threshold = 100;
let allowShift = true;
let index = 0;

function getItemWidth() {
  return window.innerWidth * 0.7;
}

function getItemOffset() {
  return window.innerWidth * 0.15;
}

function setupItemContainer(selectedIndex = 0) {
  $itemsContainer.style.width = `${getItemWidth() * (itemLength + 2)}px`;
  $itemsContainer.style.left = `${(selectedIndex + 1) * -getItemWidth() + getItemOffset()}px`;
}

function shiftSlide(dir, action) {
  $itemsContainer.classList.add('shifting');

  if (allowShift) {
    if (!action) {
      posInitial = $itemsContainer.offsetLeft;
    }

    if (dir == 1) {
      $itemsContainer.style.left = `${posInitial - getItemWidth()}px`;
      index++;
    } else if (dir == -1) {
      $itemsContainer.style.left = `${posInitial + getItemWidth()}px`;
      index--;
    }
  }

  allowShift = false;
}

function dragStart(e) {
  e.preventDefault();
  posInitial = $itemsContainer.offsetLeft;

  if (e.type == 'touchstart') {
    posX1 = e.touches[0].clientX;
  } else {
    posX1 = e.clientX;
    document.onmouseup = dragEnd;
    document.onmousemove = dragMove;
  }
}

function dragEnd(e) {
  posFinal = $itemsContainer.offsetLeft;
  if (posFinal - posInitial < -threshold) {
    shiftSlide(1, 'drag');
  } else if (posFinal - posInitial > threshold) {
    shiftSlide(-1, 'drag');
  } else {
    $itemsContainer.style.left = `${posInitial}px`;
  }

  document.onmouseup = null;
  document.onmousemove = null;
}

function dragMove(e) {
  if (e.type == 'touchmove') {
    posX2 = posX1 - e.touches[0].clientX;
    posX1 = e.touches[0].clientX;
  } else {
    posX2 = posX1 - e.clientX;
    posX1 = e.clientX;
  }
  $itemsContainer.style.left = `${$itemsContainer.offsetLeft - posX2}px`;
}

function checkPoint() {
  $itemsContainer.classList.remove('shifting');

  Array.from($items).forEach(function (el) {
    el.classList.remove('selected');
  });

  if (index == -1) {
    $itemsContainer.style.left = `${itemLength * -getItemWidth() + getItemOffset()}px`;
    index = itemLength - 1;
  }

  if (index == itemLength) {
    $itemsContainer.style.left = `${-getItemWidth() + getItemOffset()}px`;
    index = 0;
  }

  $items[index + 1].classList.add('selected');

  allowShift = true;
}

// initialize container width & position
setupItemContainer();

$items[1].classList.add('selected');

$itemsContainer.addEventListener('mousedown', dragStart);
$itemsContainer.addEventListener('touchstart', dragStart);
$itemsContainer.addEventListener('touchend', dragEnd);
$itemsContainer.addEventListener('touchmove', dragMove);

$itemsContainer.addEventListener('transitionend', checkPoint);

window.addEventListener('resize', function () {
  setupItemContainer(index);
});
