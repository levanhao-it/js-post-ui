import postApi from './api/postApi';
import { initPagination, initSearch, renderPagination, renderPostList } from './utils';

async function handleFilterChange(filterName, filterValue) {
  try {
    //update query params
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);

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
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('get all failed: ', error);
    //show model or toast
  }
})();
