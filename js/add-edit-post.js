import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

function removeUnusedFileds(formValues) {
  const payload = { ...formValues };
  // imageSoure='picsum' --> remove image
  // imageSoure='upload' --> remove imageUrl
  // finally remove imageSource
  if (payload.imageSource === 'upload') {
    delete payload.imageUrl;
  } else {
    delete payload.image;
  }
  delete payload.imageSource;

  // remove id if it's add mode
  if (!formValues.id) delete payload.id;
  return payload;
}

function jsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}

async function handlePostFormSubmit(formValues) {
  try {
    const payload = removeUnusedFileds(formValues);
    const formData = jsonToFormData(payload);
    // check add/edit mode
    // S1: based on search params (check id)
    // S2: check id in formValues
    // call Api
    // let savedPost = null;
    // if (formValues.id) {
    //   savedPost = await postApi.update(formValues);
    // } else {
    //   savedPost = await postApi.add(formValues);
    // }
    const savedPost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    // show cuccess message
    toast.success('Save post successfully!');
    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 500);
  } catch (error) {
    console.log('failed to save post', error);
    toast.error(`Error: ${error.message} `);
  }
}

// main
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    const nameTitle = Boolean(postId) ? 'Edit post' : 'Add a new post';
    const nameTilleElement = document.getElementById('postDetailTitle');
    if (nameTilleElement) {
      nameTilleElement.innerHTML = `<span>${nameTitle}</span>`;
    }

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
      onSubmit: handlePostFormSubmit,
    });
  } catch (error) {
    console.log('fetch data failed from API', error);
  }
})();
