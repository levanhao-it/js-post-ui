import postApi from './api/postApi';
import studentApi from './api/studentApi';

async function main() {
  try {
    const queryParam = {
      _page: 1,
      _limit: 5,
    };
    const data = await postApi.getAll(queryParam);
    console.log(data);
  } catch (error) {
    console.log('get all failed: ', error);
    //show model or toast
  }
}
main();
