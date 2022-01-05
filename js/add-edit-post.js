import postApi from './api/postApi';
import { initPostForm } from './utils';

// main
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    let defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          imageUrl: '',
          author: '',
          description: '',
        };
    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: (formValues) => console.log(formValues),
    });
  } catch (error) {
    console.log('fetch data failed from API', error);
  }
})();
