import { CloudinaryStorage } from 'multer-storage-cloudinary'; 
import multer from 'multer'; 
import cloudinary from './cloudinaryConfig.js'; 


const storageBanner = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'banner', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }], 
  },
});

// Konfigurasi storage untuk Dashboard
const storageDashboard = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dashboard', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }], 
  },
});

// Konfigurasi storage untuk Dokumentasi
const storageDokumentasi = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'dokumentasi', 
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }], 
    },
  });

  // Konfigurasi storage untuk Tentang Kegiatan
const storageTentangKegiatan = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'tentangKegiatan', 
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }], 
    },
  });

const uploadBanner = multer({ storage: storageBanner });
const uploadDashboard = multer({ storage: storageDashboard });
const uploadDokumentasi = multer({ storage: storageDokumentasi });
const uploadTentangKegiatan = multer({ storage: storageTentangKegiatan });



export { uploadBanner, uploadDashboard, uploadDokumentasi, uploadTentangKegiatan };
