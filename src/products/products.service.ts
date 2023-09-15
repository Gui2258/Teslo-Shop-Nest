import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException }
  from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';
import { validate as IsUUID } from "uuid";

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductImage ,Product} from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource : DataSource,

  ){}


  async create(createProductDto: CreateProductDto, user : User) {
    try {

      const {images = [], ...productdetails} = createProductDto;

      const product = this.productRepository.create({
        ...createProductDto,
        images : images.map(image => this.productImageRepository.create({url:image})),
        user,
      });
      await this.productRepository.save(product);
      return {...product, images : images};

    } catch (error) {
      this.handleDBExeption(error);    
    }
  }

  async findAll(paginationDto : PaginationDto) {

    const {limit = 10, offset = 0} = paginationDto;
   
    const product =  await this.productRepository.find({
      take: limit,
      skip: offset,
      relations:{
        images:true
      }
    })

    return product.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }))
  }

  async findOne(term: string) {

    let product : Product;
    if(IsUUID(term))
      product =  await this.productRepository.findOneBy({id:term});
    else{
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug',{
          title : term.toUpperCase(),
          slug : term.toLowerCase(),
        })
        .leftJoinAndSelect('product.images','prodImages')
        .getOne(); 

    }

    if(!product)
      throw new NotFoundException(`The product with paramteter = ${term} not found`)

    return (product);
  }

  async update(id: string, updateProductDto: UpdateProductDto, user : User) {
    
    const {images, ...toUpdate} = updateProductDto;

    const product = await this.productRepository.preload({id, ...toUpdate})

    if(!product)
      throw new NotFoundException(`The product with id ${id} not found`)


      const queryRuner = this.dataSource.createQueryRunner();
      await queryRuner.connect();
      await queryRuner.startTransaction();

    try {

      if(images){
        await queryRuner.manager.delete(ProductImage,{product:{id}})
        product.images = images.map(image => this.productImageRepository.create({url:image}))
      }

      product.user = user;
      await queryRuner.manager.save(product);
      await queryRuner.commitTransaction();
      await queryRuner.release();
      return this.findOnePlain(id);
      
    } catch (error) {

      await queryRuner.rollbackTransaction();
      await queryRuner.release(); 
      this.handleDBExeption(error);
    }

  }

  async remove(id: string) {
    const product  = await this.findOne(id);
    
    await this.productRepository.remove(product);
  }

  private handleDBExeption(error : any){

  if(error.code ==='23505')
    throw new BadRequestException(error.detail);

  this.logger.error(error);
  throw new InternalServerErrorException(`Unexpected error, check the server logs`);
  };

  async findOnePlain(term : string){
    const {images = [], ...rest} = await this.findOne(term);
    return {...rest, images: images.map(images => images.url)}
  }

  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return query
        .delete()
        .where({})
        .execute();
      
    } catch (error) {
      this.handleDBExeption(error);
    }
  }
}
