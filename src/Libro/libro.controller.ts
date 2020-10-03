import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post, Put, Query, Res, Session
} from "@nestjs/common";
import {LibroService} from "./libro.service";
import {LibroCreateDto} from "./dto/libro.create-dto";
import {validate,ValidationError} from "class-validator";
import {LibroEntity} from "./libro.entity";

@Controller('libro')
export class LibroController{
    constructor( // Inyección de dependencias
        private readonly _libroService: LibroService
    ) {
    }

    @Post('login')
    loginPost(
        @Body() parametrosConsulta,
        @Res() response,
        @Session() session
    ){
        const usuario = parametrosConsulta.usuario;
        const password = parametrosConsulta.password;
        if(usuario == 'adrian' && password =='1234'){
            session.usuario = usuario
            session.roles = ['Administrador']
            return response.redirect('/libro/vista/principal')
        }else{
            return response.redirect('/login')
        }
    }


    @Get('vista/principal')
    async principal(
        @Res() res,
        @Query() parametrosConsulta,
        @Session() session,
    ){
        if(session.usuario == 'adrian'){

            let resultadoEncontrado
            try{
                resultadoEncontrado = await this._libroService.buscarTodos(parametrosConsulta.busqueda);
            }catch (e) {
                throw new InternalServerErrorException('Error encontrado libros')
            }
            if(resultadoEncontrado){
                res.render(
                    'libro/viewLibro', //nombre de la vista (archivo)
                    {
                        arregloLibro: resultadoEncontrado,
                        parametrosConsulta: parametrosConsulta
                    });
            }else{
                throw new NotFoundException('No se encontraron libros')
            }
        }else{
            return res.redirect('/login')
        }

    }

    @Get('vista/crear')
    crearLibroVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Session() session,
    ){
        if(session.usuario == 'adrian'){
            res.render(
                'libro/crear', //nombre de la vista (archivo)
                {
                    error: parametrosConsulta.error,
                    nombreLibro: parametrosConsulta.nombreLibro,
                    nombreAutor: parametrosConsulta.nombreAutor,
                    precio: parametrosConsulta.precio,
                    editorial: parametrosConsulta.editorial,
                    fechaPublicacion: parametrosConsulta.fechaPublicacion,
                }
            )
        }else{
            return res.redirect('/login')
        }

    }
    @Get('vista/editar/:id')
    async editarLibroVista(
        @Param() parametrosRuta,
        @Query() parametrosConsulta,
        @Res() res,
        @Session() session
    ){
        if(session.usuario == 'adrian'){
            const id = Number(parametrosRuta.id)
            let libroEncontrado;
            try{
                libroEncontrado = await this._libroService.buscarUno(id);
            }catch(error){
                console.error('Error del servidor')
                return res.redirect('/libro/vista/principal?mensaje=Error buscando libro')
            }
            if(libroEncontrado){
                return res.render(
                    'libro/crear',
                    {
                        error: parametrosConsulta.error,
                        libro: libroEncontrado
                    }
                )
            }else{
                return res.redirect('/libro/vista/principal?mensaje=Libro no encontrado')
            }

        }else{
            return res.redirect('/login')
        }

    }

    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() parametrosCuerpo,
        @Res() res
    ){
        const libroValido = new LibroCreateDto();
        libroValido.nombreLibro=parametrosCuerpo.nombreLibro;
        libroValido.nombreAutor=parametrosCuerpo.nombreAutor;
        libroValido.precio=parametrosCuerpo.precio;
        libroValido.editorial=parametrosCuerpo.editorial;
        libroValido.fechaPublicacion=parametrosCuerpo.fechaPublicacion;
        const errores: ValidationError[] = await validate(libroValido);
        if(errores.length>0){
            console.log('Error', errores);
            const mensajeError = 'Datos incorrectos'
            return res.redirect('/libro/vista/crear?error=' + mensajeError);
        }else{
            res.redirect('/libro/vista/principal');
        }
        let respuestaCreacionLibro

        try{
            respuestaCreacionLibro =await this._libroService.crearUno(parametrosCuerpo)
        }catch(error){
            console.error(error);
            const mensajeError = 'Error creando libro'
            return res.redirect('/libro/vista/crear?error=' + mensajeError);
        }
        if(respuestaCreacionLibro){
            return res.redirect('/libro/vista/principal')
        }else{
            const mensajeError = 'Datos incorrectos'
            return res.redirect('/libro/vista/crear?error=' + mensajeError);
        }

    }
    @Post('editarDesdeVista/:id')
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() parametrosCuerpo,
        @Res() res
    ){
        const libroEditado ={
            id: Number(parametrosRuta.id),
            nombreLibro: parametrosCuerpo.nombreLibro,
            nombreAutor: parametrosCuerpo.nombreAutor,
            precio: parametrosCuerpo.precio,
            editorial: parametrosCuerpo.editorial,
            fechaPublicacion: parametrosCuerpo.fechaPublicacion

        } as LibroEntity;
        try {
            await this._libroService.editarUno(libroEditado)
            return res.redirect('/libro/vista/principal?mensaje=Libro editado')
        }catch(error){
            console.error(error);
            return res.redirect('/libro/vista/principal?mensaje=Error editado libro')
        }

    }




    @Post('eliminarDesdeVista/:id')
    async eliminarDesdeVista(

        @Param() parametrosRuta,
        @Res() res
    ){
        try{
            const id = Number(parametrosRuta.id);
            await this._libroService.eliminarUno(id)
            return res.redirect('/libro/vista/principal?mensaje=Libro eliminado')
        }catch (error) {
            console.log(error);
            return res.redirect('/libro/vista/principal?mensaje=Error al eliminar libro')
        }
    }




}