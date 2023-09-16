import { ApiProperty } from "@nestjs/swagger";

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductImage{

    @ApiProperty({
        example:'2',
        description:'Product ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn()
    id : number;

    @ApiProperty()
    @Column('text')
    url : string;

    @ManyToOne(
        () => Product,
        (product) => product.images,
        {onDelete:'CASCADE'}
    )
    product : Product;
}