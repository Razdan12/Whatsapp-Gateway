const Setting = {
  port: process.env.PORT,

  // file upload
  allowedFileMimes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  allowedImageMimes: ['image/jpeg', 'image/jpg', 'image/png'],
  allowedVideoMimes: ['video/mp4', 'video/webm'],
  defaultLimitSize: 3000000, // 3 MB
};

export default Setting;
