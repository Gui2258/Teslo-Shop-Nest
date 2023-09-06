import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException }
  from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { validate as IsUUID } from "uuid";

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductImage ,Product} from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

  ){}


  async create(createProductDto: CreateProductDto) {
    try {

      const {images = [], ...productdetails} = createProductDto;

      const product = this.productRepository.create({
        ...createProductDto,
        images : images.map(image => this.productImageRepository.create({url:image}))
      });
      await this.productRepository.save(product);
      return product;

    } catch (error) {
      this.handleDBExeption(error);    
    }
  }

  async findAll(paginationDto : PaginationDto) {

    const {limit = 10, offset = 0} = paginationDto;
   
    return await this.productRepository.find({
      take: limit,
      skip: offset,
      //TODO relaciones
    })
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
        }).getOne(); 

    }

    if(!product)
      throw new NotFoundException(`The product with paramteter = ${term} not found`)

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const product = await this.productRepository.preload({
      id : id,
      ...updateProductDto,
      images : []
    })

    if(!product)
      throw new NotFoundException(`The product with id ${id} not found`)

    try {
      return this.productRepository.save(product);
      
    } catch (error) {
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
}
