import {Injectable} from "@nestjs/common";
import {FindManyOptions, Like, Repository} from "typeorm";
import {LibroEntity} from "./libro.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class LibroService{

    constructor(//inyeccion de dependencias
        @InjectRepository(LibroEntity)
        private repositorio: Repository<LibroEntity>

    ) {
    }
    crearUno(nuevoLibro: LibroEntity) {
        return this.repositorio.save(nuevoLibro) // promesa
    }

    buscarTodos(textoConsulta?: string) {
        const consulta: FindManyOptions<LibroEntity> ={
            where:[
                {
                    nombreLibro: Like(`%${textoConsulta}%`)
                },
                {
                    nombreAutor: Like(`%${textoConsulta}%`)
                }
            ]
        }


        return this.repositorio.find(consulta) // promesa
    }

    buscarUno(id: number) {
        return this.repositorio.findOne(id) // promesa
    }

    editarUno(usuarioEditado: LibroEntity) {
        return this.repositorio.save(usuarioEditado);
    }

    eliminarUno(id: number) {
        return this.repositorio.delete(id);
    }
}