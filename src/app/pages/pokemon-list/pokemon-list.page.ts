import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';

export interface PokemonListItem {
  name: string;
  id: number;
}

export const TYPE_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  fire:     { bg: '#FAECE7', text: '#993C1D', bar: '#D85A30' },
  water:    { bg: '#E6F1FB', text: '#185FA5', bar: '#378ADD' },
  grass:    { bg: '#EAF3DE', text: '#3B6D11', bar: '#639922' },
  electric: { bg: '#FAEEDA', text: '#854F0B', bar: '#EF9F27' },
  psychic:  { bg: '#FBEAF0', text: '#993556', bar: '#D4537E' },
  ice:      { bg: '#E1F5EE', text: '#0F6E56', bar: '#1D9E75' },
  dragon:   { bg: '#EEEDFE', text: '#3C3489', bar: '#7F77DD' },
  dark:     { bg: '#F1EFE8', text: '#444441', bar: '#5F5E5A' },
  fairy:    { bg: '#FBEAF0', text: '#72243E', bar: '#D4537E' },
  fighting: { bg: '#FAECE7', text: '#712B13', bar: '#993C1D' },
  poison:   { bg: '#EEEDFE', text: '#534AB7', bar: '#7F77DD' },
  ground:   { bg: '#FAEEDA', text: '#633806', bar: '#BA7517' },
  rock:     { bg: '#F1EFE8', text: '#5F5E5A', bar: '#888780' },
  bug:      { bg: '#EAF3DE', text: '#27500A', bar: '#3B6D11' },
  ghost:    { bg: '#EEEDFE', text: '#26215C', bar: '#534AB7' },
  steel:    { bg: '#F1EFE8', text: '#444441', bar: '#888780' },
  flying:   { bg: '#E6F1FB', text: '#0C447C', bar: '#378ADD' },
  normal:   { bg: '#F1EFE8', text: '#5F5E5A', bar: '#888780' },
};

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
})
export class PokemonListPage implements OnInit {
  allPokemons: PokemonListItem[] = [];
  filteredPokemons: PokemonListItem[] = [];

  searchQuery = '';
  activeType = 'all';
  loadingList = false;

  readonly typeFilters = ['all','fire','water','grass','electric','psychic','dragon','fighting','ghost','dark','steel','fairy'];

  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.loadingList = true;
    this.pokemonService.getPokemons(151).subscribe({
      next: (res) => {
        this.allPokemons = res.results.map((p: any, i: number) => ({ name: p.name, id: i + 1 }));
        this.filteredPokemons = [...this.allPokemons];
        this.loadingList = false;
      },
      error: () => { this.loadingList = false; }
    });
  }

  filterList() {
    const q = this.searchQuery.toLowerCase().trim();
    if (this.activeType === 'all') {
      this.filteredPokemons = this.allPokemons.filter(p => p.name.includes(q));
    } else {
      this.pokemonService.getPokemonByType(this.activeType).subscribe({
        next: (res) => {
          const names = new Set<string>(res.pokemon.map((p: any) => p.pokemon.name));
          this.filteredPokemons = this.allPokemons.filter(p => names.has(p.name) && p.name.includes(q));
        }
      });
    }
  }

  setType(type: string) {
    this.activeType = type;
    this.filterList();
  }

  selectPokemon(item: PokemonListItem) {
    this.router.navigate(['/pokemon-detail', item.name, item.id]);
  }

  getThumb(id: number): string {
    return this.pokemonService.getThumbUrl(id);
  }

  getTypeColor(type: string) {
    return TYPE_COLORS[type] ?? TYPE_COLORS['normal'];
  }
}