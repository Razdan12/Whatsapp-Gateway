const imageFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const validateImageFileType = (file) => {
  if (!file) return false;
  return imageFileTypes.includes(file.mimetype);
};

export { validateImageFileType };
