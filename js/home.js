import postApi from './api/postApi';
import { initPagination, initSearch, renderPagination, renderPostList, toast } from './utils';

function showModal(modalElement) {
  if (!window.bootstrap) return;
  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) modal.show();
  const confirm = modalElement.querySelector('.danger');
  if (!confirm) return;
  confirm.addEventListener('click', (event) => {});
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      const modalElement = document.getElementById('modalRemove');
      if (!modalElement) return;
      const post = event.detail;
      const message = ` Are you sure to remove post ${post.title}`;
      const dangerElement = document.querySelector('.danger');
      if (dangerElement) {
        dangerElement.textContent = message;
      }
      if (!window.bootstrap) return;
      const modal = new window.bootstrap.Modal(modalElement);
      if (modal) modal.show();
      const confirm = modalElement.querySelector('.confirm');
      if (!confirm) return;
      confirm.addEventListener('click', async (event) => {
        await postApi.remove(post.id);
        await handleFilterChange();
        toast.success('Remove post successfully');
        modal.hide();
      });
    } catch (error) {
      console.log('failed to remove post', error);
      toast.error(error.message);
    }
  });
}

async function handleFilterChange(filterName, filterValue) {
  try {
    //update query params
    const url = new URL(window.location);

    if (filterName) url.searchParams.set(filterName, filterValue);

    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    history.pushState({}, '', url);

    // fetch API
    // re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('failed to fetch post list', error);
  }
}

(async () => {
  try {
    const url = new URL(window.location);

    //update search param if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    registerPostDeleteEvent();

    // attach click event links
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });
    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    // set default pagination (_limit,_page) on URL
    // render post list based URL params
    // set default query param if not existed
    // const { data, pagination } = await postApi.getAll(queryParams);
    // renderPostList('postList', data);
    // renderPagination('pagination', pagination);
    handleFilterChange();

    // scroll
    const showOnPx = 100;
    const backToTopButton = document.querySelector('.back-to-top');
    const scrollContainer = () => {
      return document.documentElement || document.body;
    };

    const goToTop = () => {
      document.body.scrollIntoView({
        behavior: 'smooth',
      });
    };

    document.addEventListener('scroll', () => {
      const scrolledPercentage =
        (scrollContainer().scrollTop /
          (scrollContainer().scrollHeight - scrollContainer().clientHeight)) *
        100;

      // pageProgressBar.style.width = `${scrolledPercentage}%`;

      if (scrollContainer().scrollTop > showOnPx) {
        backToTopButton.classList.remove('hidden');
      } else {
        backToTopButton.classList.add('hidden');
      }
    });

    backToTopButton.addEventListener('click', goToTop);
  } catch (error) {
    console.log('get all failed: ', error);
    //show model or toast
  }
})();
