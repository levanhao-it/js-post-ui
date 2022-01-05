import { setBackgoundImage, setTextContent } from '.';
import { setFieldValue } from './commom';
import * as yup from 'yup';

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
    description: yup.string().required('Please enter description'),
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
    ['title', 'author'].forEach((name) => setFieldError(form, name, ''));

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
  return false;
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;
  setFormValues(form, defaultValues);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // get form values
    const formValues = getFormValue(form);
    console.log(formValues);
    // validation
    // if valid trigger submit callback
    // otherwise, show validation errors
    if (validatePostForm(form, formValues)) return;
  });
}
