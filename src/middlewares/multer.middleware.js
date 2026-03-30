import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname + '-' + uniqueSuffix)
    }
})

export const upload = multer({ storage })

//Multer ek middleware hai jo file uploads handle karta hai. Jab user koi image submit kare form se, toh browser raw binary data bhejta hai — Multer us data ko pakad ke teri local disk pe save karta hai.
//Real flow:
//User → Form submit (image) → Multer → /public/temp/file.jpg → Cloudinary upload