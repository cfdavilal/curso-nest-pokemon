import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator"
import { isInt16Array } from "util/types"

export class CreatePokemonDto {
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number
    @IsString()
    @MinLength(1)
    name: string
}
