function showModal(modalElement) {
  if (!window.bootstrap) return;
  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) modal.show();
}
// handel click for all imgs -->Event Delegation
// img click --> find all imgs with the same album / gallery
// determine index of selected
// show model with selexted img
// handel pre / next click

export function resigterLightBox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  //check if this modal is register or not
  if (Boolean(modalElement.dataset.registered)) return;

  // selector
  const imageElement = modalElement.querySelector(imgSelector);
  const prevButton = modalElement.querySelector(prevSelector);
  const nextButton = modalElement.querySelector(nextSelector);
  if (!imageElement || !prevButton || !nextButton) return;

  //lightbox vars
  let imgList = [];
  let currenrIndex = 0;

  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src;
  }

  document.addEventListener('click', (event) => {
    const { target } = event;
    console.log(target);
    if (target.tagName !== 'IMG' || !target.dataset.album) return;
    // img  with  data-album
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`);
    currenrIndex = [...imgList].findIndex((x) => x === target);

    // show imge at index
    showImageAtIndex(currenrIndex);
    // show modal

    showModal(modalElement);
  });

  prevButton.addEventListener('click', () => {
    // show prev img of current album
    currenrIndex = (currenrIndex - 1 + imgList.length) % imgList.length;
    showImageAtIndex(currenrIndex);
  });
  nextButton.addEventListener('click', () => {
    // show next img of current album
    currenrIndex = (currenrIndex + 1) % imgList.length;
    showImageAtIndex(currenrIndex);
  });

  // mark modal already register
  modalElement.dataset.registered = 'true';
}
