import postApi from './api/postApi';
import { initPagination, initSearch, renderPagination, renderPostList, toast } from './utils';

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      const post = event.detail;
      const message = ` Are you sure to remove post ${post.title}`;
      if (window.confirm(message)) {
        await postApi.remove(post.id);

        await handleFilterChange();
        toast.success('Remove post successfully');
      }
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
  } catch (error) {
    console.log('get all failed: ', error);
    //show model or toast
  }
})();
