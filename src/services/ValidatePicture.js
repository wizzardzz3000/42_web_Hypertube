export default {
  picture: {
    // Checking picture format
    format: value => {
      let imageType = /image.*/;
      if (!value.type.match(imageType)) {
        return false;
      }
      return true;
    },
    // Checking picture size
    size: value => {
      if (value && value.size / 1024 / 1024 < 2) {
        return true;
      } else {
        return false;
      }
    }
  }
};
