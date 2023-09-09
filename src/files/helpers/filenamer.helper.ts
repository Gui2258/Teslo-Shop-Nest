import { v4 as uuid } from "uuid";
  
  export const fileNamer = (req : Express.Request, file : Express.Multer.File, cb : Function)=>{


    if(!file)
      return cb(new Error('The file is empty'), false);

    const fileExtention = file.mimetype.split('/')[1];
   
    const fileName = `${uuid()}.${fileExtention}`;

   
      return cb(null, fileName)

  }