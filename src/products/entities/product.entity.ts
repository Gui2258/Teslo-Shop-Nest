import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany , ManyToOne} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { ProductImage } from "./product-images.entity";
import { User } from "src/auth/entities/user.entity";


@Entity()
export class Product {

    @ApiProperty({
        example:'0bacf878-18c3-4dcc-9aa0-7f1c64186c7d',
        description:'Product ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ApiProperty({
        example:'Teslo T-Shirt',
        description:'Product Title',
        uniqueItems: true,
    })
    @Column('text',{unique:true})
    title : string;

    @ApiProperty({
        example:'0',
        description:'Product Price',
    })
    @Column('float',{default:0})
    price : number;

    @ApiProperty(
        {
            example:'Designed for fit, comfort and style',
            description:'Product description',
            default:null,
        }
    )
    @Column({
        type : 'text', 
        nullable: true,
    })
    description : string;

    @ApiProperty(   
        {
            example:'teslo_t_shirt',
            description:'Product slug - for SEO',
            uniqueItems:true, 
        }
    )
    @Column('text',{unique:true})
    slug:string;

    @ApiProperty({
        example:10,
        description:'Product stock aviability',
        default:0
        
    })
    @Column('int',{default:0})
    stock:number;

    @ApiProperty({
        example:['M','XL','S'],
        description:'Product Sizes',
        default:[]
    })
    @Column('text',{array:true})
    sizes:string[];

    @ApiProperty({
        example:'Women',
        description:'Product gender',
    })
    @Column('text')
    gender:string;

    @ApiProperty({  
        example:['Men', 'pants', 'new'],
        description:'Product tags',
        
    })
    @Column('text',{
        array:true,
        default:[],
    })
    tags:string[];

    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {cascade:true, eager:true}
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user)=> user.product,
        {eager:true}
    )
    user : User;
 

    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug)
            this.slug = this.title

        this.slug = this.slug
            .toLocaleLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLocaleLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }
}
