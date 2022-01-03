import dayjs from 'dayjs';
import postApi from './api/postApi';
import { resigterLightBox, setTextContent } from './utils';

function renderPostDetail(post) {
  if (!post) return;

  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailTimeSpan', dayjs(post.updatedAt).format('DD/MM/YYYY HH:mm'));
  // render hero image (imgUrl)
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`;
    heroImage.addEventListener('error', () => {
      heroImage.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }
  // render edit
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit Post';
  }
}

(async () => {
  resigterLightBox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  });

  // get post id from URL
  // fetch post detail API
  // render post detail
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const idPost = searchParams.get('id');
    if (!idPost) {
      console.log('Post not found');
      return;
    }

    const post = await postApi.getById(idPost);
    // console.log(data);
    renderPostDetail(post);
  } catch (error) {
    console.log('fail to fetch post detail', error);
    //show modal, toast error
  }
})();
