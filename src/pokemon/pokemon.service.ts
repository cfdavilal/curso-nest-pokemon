import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { CreatePokemonDto } from './dto/create-pokemon.dto'
import { UpdatePokemonDto } from './dto/update-pokemon.dto'
import { Model, isValidObjectId } from 'mongoose'
import { Pokemon } from './entities/pokemon.entity'
import { InjectModel } from '@nestjs/mongoose'
import { PaginationDto } from 'src/common/dto/pagination.dto'

@Injectable()
export class PokemonService {

  constructor(@InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>) {

  }
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon
    } catch (error) {
      this.handleExceptions(error)
    }


  }

  findAll(paginationdto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationdto
    return this.pokemonModel.find().limit(limit).skip(offset).sort({
      no: 1
    }).select('-__v')
  }

  async findOne(term: string) {
    let pokemon: Pokemon
    //* no
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({
        no: term
      })
    }
    //* mongo id
    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }
    //*
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim()
      })
    }
    if (!pokemon) throw new NotFoundException(`pokemon with id, name or no ${term} not found`)
    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term)
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
    }
    try {
      await pokemon.updateOne(updatePokemonDto, { new: true })
    } catch (error) {
      this.handleExceptions(error)
    }

    return { ...pokemon.toJSON(), ...updatePokemonDto }
  }

  async remove(id: string) {
    //const pokemon = await this.findOne(id)
    //await pokemon.deleteOne()
    //const result = await this.pokemonModel.findByIdAndDelete(id)
    const result = await this.pokemonModel.deleteOne({ _id: id })
    if (result.deletedCount == 0) {
      throw new BadRequestException(`Pokemon with id ${id} not found`)
    }
    return result
  }

  async deleteAll() {
    await this.pokemonModel.deleteMany({})
  }

  async insertGroup(pokemons: Pokemon[]) {
    await this.pokemonModel.insertMany(pokemons)
  }

  private handleExceptions(error: any) {
    if (error.code == 11000) {
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`)
    } else {
      throw new InternalServerErrorException(`Can't create pokemon - Check server logs`)
    }
  }
}
