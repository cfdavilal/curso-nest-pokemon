import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { PokeResponse } from './interfaces/poke-response.interface'
import { PokemonService } from 'src/pokemon/pokemon.service'
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto'

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios

  constructor(private readonly pokemonService: PokemonService) {

  }

  async executeSeed() {
    this.pokemonService.deleteAll()
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=150')

    const pokemons = []


    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no: number = Number(segments[segments.length - 2])
      //*Insertar por lotes
      const createPokemonDto: CreatePokemonDto = {
        name,
        no
      }
      pokemons.push(createPokemonDto)
    })
    await this.pokemonService.insertGroup(pokemons)


    return data.results
  }


}
