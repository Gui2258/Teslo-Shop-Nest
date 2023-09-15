import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService : ProductsService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    ){}
  
  async runSeed(){
    await this.deleteAllTables();

    const adminuser = await this.insertUsers();
    await this.insertNewProducts(adminuser);
    return "Seed executed!!!"
  }

  private async deleteAllTables(){
    this.productService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertNewProducts(user : User){
    await this.productService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];

    products.forEach(producto => insertPromises.push(this.productService.create(producto, user)));

    await Promise.all(insertPromises);

  } 


  private async insertUsers(){
    const seedUsers = initialData.users;
    const users:User[]=[];

    seedUsers.forEach((user)=>{users.push(this.userRepository.create(user))})

    const dbUsers = await this.userRepository.save(seedUsers);
    
    return dbUsers[0];
  }

}
