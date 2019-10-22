function ValidatePictureContent(value) {
  var result = false;
  let pic = new Image();

  pic.src = window.URL.createObjectURL(value);
  result = pic.onload = function() {
    let width = pic.naturalWidth;
    let height = pic.naturalHeight;
    window.URL.revokeObjectURL(pic.src);
    if (width && height) {
      return true;
    }
    return false;
  };
  return result;
}

export { ValidatePictureContent };
