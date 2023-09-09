  
  
  export const fileFilter = (req : Express.Request, file : Express.Multer.File, cb : Function)=>{


    if(!file)
      return cb(new Error('The file is empty'), false);

    const fileExtention = file.mimetype.split('/')[1];
    const validExtentions = ['jpg', 'jpeg', 'png' , 'gif' ];

    if(validExtentions.includes(fileExtention))
      return cb(null, true)

  }