import { randomNumber, setBackgoundImage, setTextContent } from '.';
import { setFieldValue } from './commom';
import * as yup from 'yup';

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl); //hidden field
  setBackgoundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValue(form) {
  const formValues = {};

  // s1: query each input and add to values object
  // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`);
  //   if (field) formValues[name] = field.value;
  // });

  // s2: using FormData
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

function getTitleError(form) {
  const titleELement = form.querySelector('[name="title"]');
  if (!titleELement) return;
  //required
  // at least two words
  if (titleELement.validity.valueMissing) {
    return 'Please enter title';
  }
  if (titleELement.value.split(' ').filter((x) => !!x && x.length >= 3).length < 2)
    return 'Please enter at least two words of 3 character';
  return '';
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least to word',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please random a background image')
        .url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select an image to upload', (file) => {
          return Boolean(file?.name);
        })
        .test('max-3mb', 'The image is too large (max-3mb)', (file) => {
          const fileSize = file?.file || 0;
          const MAX_SIZE = 3 * 1024 * 1024; // 3mb
          // const MAX_SIZE = 3 * 1024 * 1024;
          return fileSize <= MAX_SIZE;
        }),
    }),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

async function validatePostForm(form, formValues) {
  try {
    // reset prevous error
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''));

    // start validating
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    console.log(error.name);
    console.log(error.inner);

    const errorLog = {};
    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        // ingroe if the field is already logged
        if (errorLog[name]) continue;

        // set field error and mark as logged
        setFieldError(form, name, validationError.message);

        errorLog[name] = true;
      }
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }
}

function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = false;
    button.textContent = 'Save';
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage');
  if (!randomButton) return;

  randomButton.addEventListener('click', () => {
    // randomId
    // build URL
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;

    //set imageURL input + bg
    setFieldValue(form, '[name="imageUrl"]', imageUrl); //hidden field
    setBackgoundImage(document, '#postHeroImage', imageUrl);
  });
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]');
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}

function initRadioImageSoucre(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]');
  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSourceControl(form, event.target.value));
  });
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]');
  if (!uploadImage) return;
  uploadImage.addEventListener('change', (event) => {
    console.log('selected file', event.target.files[0]);
    const file = event.target.files[0];
    if (!file) {
      setBackgoundImage(document, '#postHeroImage', '');
      validateFormField(form, { imageSource: ImageSource.UPLOAD, image: file }, 'image');
    }
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgoundImage(document, '#postHeroImage', imageUrl);

      //trigger validation of upload input
      validateFormField(form, { imageSource: ImageSource.UPLOAD, image: file }, 'image');
    }
  });
}

async function validateFormField(form, formValues, name) {
  try {
    // clear previous error
    setFieldError(form, name, '');

    const schema = getPostSchema();
    await schema.validateAt(name, formValues);
  } catch (error) {
    setFieldError(form, name, error.message);
  }
  // show validation error (if any)
  const field = form.querySelector(`[name="${name}"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}

function initValidationOnchange(form) {
  ['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) {
      field.addEventListener('input', (event) => {
        const newValue = event.target.value;
        validateFormField(form, { [name]: newValue }, name);
      });
    }
  });
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  let submitting = false;

  setFormValues(form, defaultValues);

  // init event
  initRandomImage(form);
  initRadioImageSoucre(form);
  initUploadImage(form);
  initValidationOnchange(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // show loading/ disable button
    if (submitting) {
      return;
    }
    showLoading(form);
    submitting = true;

    // get form values
    const formValues = getFormValue(form);
    formValues.id = defaultValues.id;

    // validation
    // if valid trigger submit callback
    // otherwise, show validation errors
    const isValid = await validatePostForm(form, formValues);
    if (isValid) await onSubmit?.(formValues);

    hideLoading(form);
    submitting = false;
  });
}
