import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncateText } from './commom';

// to use fromNow funtion
dayjs.extend(relativeTime);

export function createPostElement(post) {
  if (!post) return;

  //find and clone template
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);

  if (!liElement) return;

  //update title, description, author, thumbail
  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 200));
  setTextContent(liElement, '[data-id="author"]', post.author);

  //calculate timespace
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`);

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/468x60?text=thumbnail';
    });
  }
  //attach even

  return liElement;
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  //clear current list
  ulElement.textContent = '';

  postList.forEach((post, idx) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
