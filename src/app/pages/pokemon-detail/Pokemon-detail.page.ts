import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';

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

    export const STAT_COLORS = ['#D85A30','#378ADD','#639922','#7F77DD','#D4537E','#EF9F27'];

    @Component({
    selector: 'app-pokemon-detail',
    templateUrl: './pokemon-detail.page.html',
    styleUrls: ['./pokemon-detail.page.scss'],
    })
    export class PokemonDetailPage implements OnInit {
    pokemon: any = null;
    species: any = null;
    loading = true;
    isShiny = false;
    readonly maxStat = 255;

    constructor(
        private route: ActivatedRoute,
        private pokemonService: PokemonService
    ) {}

    ngOnInit() {
        const name = this.route.snapshot.paramMap.get('name') ?? '';
        const id   = Number(this.route.snapshot.paramMap.get('id') ?? 0);
        this.loadDetail(name, id);
    }

    loadDetail(name: string, id: number) {
        this.loading = true;
        this.pokemonService.getPokemonDetailsAndSpecies(name, id).subscribe({
        next: ([pokemon, species]) => {
            this.pokemon = pokemon;
            this.species = species;
            this.loading = false;
        },
        error: () => { this.loading = false; }
        });
    }

    toggleShiny() { this.isShiny = !this.isShiny; }

    getSprite(): string {
        return this.pokemonService.getSpriteUrl(this.pokemon.id, this.isShiny);
    }

    getDescription(): string {
        if (!this.species) return '';
        const entry =
        this.species.flavor_text_entries.find((e: any) => e.language.name === 'es') ||
        this.species.flavor_text_entries.find((e: any) => e.language.name === 'en');
        return entry ? entry.flavor_text.replace(/\f/g, ' ') : 'Sin descripción disponible.';
    }

    getGenus(): string {
        if (!this.species?.genera) return '';
        return this.species.genera.find((g: any) => g.language.name === 'es')?.genus ?? '';
    }

    getTypeColor(type: string) {
        return TYPE_COLORS[type] ?? TYPE_COLORS['normal'];
    }

    getStatColor(i: number): string {
        return STAT_COLORS[i % STAT_COLORS.length];
    }

    statBarWidth(value: number): string {
        return `${Math.round((value / this.maxStat) * 100)}%`;
    }

    formatStatName(name: string): string {
        return name.replace('special-', 'sp. ').replace(/-/g, ' ');
    }
}