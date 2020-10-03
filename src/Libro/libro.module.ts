import {Module} from "@nestjs/common";
import {LibroController} from "./libro.controller";
import {LibroService} from "./libro.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LibroEntity} from "./libro.entity";

@Module({
    controllers: [
        LibroController
    ],
    imports: [
        TypeOrmModule
            .forFeature(
                [
                    LibroEntity
                ],
                'default' //nombre cadena de conexion
            )
    ],
    providers:[
      LibroService
    ],

})
export class LibroModule{

}