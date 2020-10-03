import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Index([
    'nombreLibro',
    'nombreAutor'
])


@Entity('libro') // nombre en la tabla
export class LibroEntity{
    @PrimaryGeneratedColumn({
        name: 'id',
        unsigned: true,
        comment: 'Identificador'
    })
    id: number;

    @Column({
        name:'nombre_libro',
        type: 'varchar',
        length: '60',
        nullable: false
    })
    nombreLibro: string;

    @Column({
        name:'nombre_autor',
        type: 'varchar',
        length: '60',
        nullable: false
    })
    nombreAutor: string;

    @Column({
        name:'precio',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true
    })
    precio?: string;

    @Column({
        name:'editorial',
        type: 'varchar',
        length: '60',
        nullable: true
    })
    editorial?: string;


    @Column({
        name:'fecha_publicacion',
        type: 'date',
        nullable: true
    })
    fechaPublicacion?: string;

}