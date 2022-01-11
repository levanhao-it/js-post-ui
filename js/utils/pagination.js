import postApi from '../api/postApi';
import { setTextContent } from './commom';

export function createPageElement(page) {
  if (!page) return;

  const pageTemplate = document.getElementById('paginationNumber');
  if (!pageTemplate) return;

  const liElement = pageTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;
  setTextContent(liElement, '[data-id="number"]', page);
  liElement.dataset.pageNumber = page;

  return liElement;
}
export async function renderPaginationNumber(onChange) {
  try {
    const url = new URL(window.location);
    const ulPagination = document.getElementById('pagination');

    if (!ulPagination) return;
    const pageNumberElement = ulPagination.querySelector('.pageNum');
    if (!pageNumberElement) return;

    // calc toPages
    const { data, pagination } = await postApi.getAll(url.searchParams);
    const { _page, _limit, _totalRows } = pagination;
    let totalPages = Math.ceil(_totalRows / _limit);

    // render page number
    const pageList = Array.from({ length: totalPages }, (_, idx) => idx + 1);
    pageList.forEach((pageNumber) => {
      const liElement = createPageElement(pageNumber);
      pageNumberElement.appendChild(liElement);
    });
    const liListElement = pageNumberElement.querySelectorAll('li');
    if (!liListElement) return;

    const page = url.searchParams.get('_page');
    if (page) {
      if (liListElement[page - 1] === undefined) {
        onChange?.(liListElement.length);
        liListElement[liListElement.length - 1].classList.add('active');
      } else {
        liListElement[page - 1].classList.add('active');
      }
    }

    liListElement.forEach((li, index) => {
      li.addEventListener('click', () => {
        const hasActive = pageNumberElement.querySelector('.active');
        if (hasActive) hasActive.classList.remove('active');
        li.classList.add('active');
        onChange?.(li.dataset.pageNumber);
      });
    });
  } catch (error) {
    console.log('fetch failed', error);
  }
}
// export function activePagination() {
//   // const liElement=document.getElementById('pagination').querySelector('.pageNum').querySelectorAll()
// }

export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  // calc toPages
  const { _page, _limit, _totalRows } = pagination;

  let totalPages = Math.ceil(_totalRows / _limit);

  // save page and totalPages to UlPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // check if enable/disable prev links
  if (_page <= 1) {
    ulPagination.firstElementChild?.classList.add('disabled');
  } else ulPagination.firstElementChild?.classList.remove('disabled');

  // check if enable/disable next links
  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}

export function initPagination({ elementId, defaultParams, onChange }) {
  //bind click event for prev/next button
  const ulPagination = document.getElementById(elementId);

  if (!ulPagination) return;

  // set current active page
  // TODO: use default param

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener('click', (e) => {
      e.preventDefault();
      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      if (page >= 2) {
        ulPagination
          .querySelector('.pageNum')
          .querySelector(`[data-page-number="${page}"]`)
          .classList.remove('active');
        ulPagination
          .querySelector('.pageNum')
          .querySelector(`[data-page-number="${page - 1}"]`)
          .classList.add('active');
        onChange?.(page - 1);
      }
    });
  }

  // add click event for next link
  const nextLink = ulPagination.lastElementChild?.lastElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();
      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      const total_Pages = ulPagination.dataset.totalPages;
      if (page >= total_Pages) return;
      if (page < total_Pages) {
        ulPagination
          .querySelector('.pageNum')
          .querySelector(`[data-page-number="${page}"]`)
          .classList.remove('active');
        ulPagination
          .querySelector('.pageNum')
          .querySelector(`[data-page-number="${page + 1}"]`)
          .classList.add('active');
        onChange?.(page + 1);
      }
    });
  }
  renderPaginationNumber(onChange);
}
