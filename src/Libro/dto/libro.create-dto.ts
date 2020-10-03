import {
    IsAlpha,
    IsBoolean, IsDecimal,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    MaxLength,
    MinLength
} from "class-validator";

export class LibroCreateDto{

    @IsNotEmpty()
    @MaxLength(60)
    @MinLength(3)
    nombreLibro : string


    @IsNotEmpty()
    @MaxLength(60)
    @MinLength(3)
    nombreAutor : string


    @IsDecimal()
    @IsOptional()
    precio: string


    @IsOptional()
    @MaxLength(60)
    editorial : string

    @MinLength(6)
    @IsOptional()
    fechaPublicacion: string;
}