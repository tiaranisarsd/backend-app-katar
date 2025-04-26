import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to store files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext); // Unique filename with original extension
    }
});

const storageBanner = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/banner/'); // Directory to store banner files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext); // Unique filename with original extension
    }
});

const storageDokumentasi = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/dokumentasi/'); // Directory to store files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext); // Unique filename with original extension
    }
});

const storageTentangKegiatan = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/tentangKegiatan'); // Directory to store files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext); // Unique filename with original extension
    }
});

export const tentangKegiatanUpload = multer({ storage: storageTentangKegiatan });
export const dokumentasiUpload = multer({ storage: storageDokumentasi });
export const upload = multer({ storage: storage });
export const bannerUpload = multer({ storage: storageBanner });
