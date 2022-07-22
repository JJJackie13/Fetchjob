import multer from "multer";

const singleStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        /* cb = callback */
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `forum-imgContent-${file.fieldname}.${file.mimetype.split("/")[1]}`
        );
    },
});

// const threadStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         /* cb = callback */
//         cb(null, "uploads/thread/");
//     },
//     filename: function (req, file, cb) {
//         cb(
//             null,
//             `${file.originalname.slice(
//                 0,
//                 file.originalname.lastIndexOf(".")
//             )}${new Date().getTime()}.${file.mimetype.split("/")[1]}`
//         );
//     },
// });

const multiStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        /* cb = callback */
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.originalname.slice(
                0,
                file.originalname.lastIndexOf(".")
            )}${new Date().getTime()}.${file.mimetype.split("/")[1]}`
        );
    },
});

const tempStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        /* cb = callback */
        cb(null, `uploads/temp`);
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.originalname.slice(
                0,
                file.originalname.lastIndexOf(".")
            )}${new Date().getTime()}.${file.mimetype.split("/")[1]}`
        );
    },
});

const singleUpload = multer({ storage: singleStorage });
const multiUpload = multer({ storage: multiStorage });
const tempUpload = multer({ storage: tempStorage });
// const threadUplaod = multer({ storage: threadStorage });

// req.file
export const multerFormSingle = singleUpload.single("logo_img");
// export const multerThreadMulti = threadUplaod.array("thread_image");
// req.files
export const multerFormMulti = multiUpload.array("imgContent");

// THREAD IMAGES
export const multerThreadMulti = tempUpload.array("thread_image");

// USER PROFILE IMAGES
export const multerAvatarSingle = tempUpload.single("avatar");
export const multerBannerSingle = tempUpload.single("banner");
export const multerEmpty = tempUpload.none();

//USER RESUME
export const multerResumeSingle = tempUpload.single("resume");
