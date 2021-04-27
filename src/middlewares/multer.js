const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'public/images')
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now().toString()}-${file.originalname}`.toLowerCase());
    }
});

const fileFilter = (req, file, cb) => {
  const isAccepted = ['image/png', 'image/jpg', 'image/jpeg', , 'image/gif'].find(acceptedFormat => acceptedFormat === file.mimetype);

  if(isAccepted){
    return cb(null, true);
  }

  return cb(null, false);
}

module.exports = multer({
  storage,
  fileFilter
})
