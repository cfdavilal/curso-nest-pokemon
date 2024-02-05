import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { PokemonService } from './pokemon.service'
import { CreatePokemonDto } from './dto/create-pokemon.dto'
import { UpdatePokemonDto } from './dto/update-pokemon.dto'
import { IS_MONGO_ID, isMongoId } from 'class-validator'
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id-pipe/parse-mongo-id.pipe'
import { PaginationDto } from 'src/common/dto/pagination.dto'

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()
    return this.pokemonService.create(createPokemonDto)
  }

  @Get()
  findAll(@Query() paginationdto: PaginationDto) {
    return this.pokemonService.findAll(paginationdto)
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term)
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(term, updatePokemonDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id)
  }
}
