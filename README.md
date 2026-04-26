# Laboratorio — Consumo de APIs con Ionic
## Aplicación Pokédex

Aplicación móvil desarrollada con **Ionic 8 + Angular 18** que consume la [PokéAPI](https://pokeapi.co/) para listar, buscar y visualizar los detalles de los primeros 151 pokémon de la primera generación.

---

## Tecnologías utilizadas

- [Ionic Framework 8](https://ionicframework.com/)
- [Angular 18](https://angular.dev/)
- [Capacitor 6](https://capacitorjs.com/) — compilación nativa Android
- [PokéAPI](https://pokeapi.co/) — API REST pública, sin autenticación
- TypeScript 5.4
- SCSS

---

## Funcionalidades implementadas

- Listado de los primeros 151 pokémon con miniatura, número y nombre
- Buscador en tiempo real por nombre
- Filtro por tipo (fuego, agua, planta, eléctrico, psíquico, etc.)
- Panel de detalle con:
  - Artwork oficial del pokémon
  - Toggle de versión shiny
  - Descripción en español
  - Altura, peso, experiencia base y habilidades
  - Barras de estadísticas base (HP, Ataque, Defensa, Velocidad, etc.)
- Diseño split-panel: lista lateral + detalle a la derecha
- Soporte de modo oscuro automático via variables de Ionic

---

## Endpoints de la PokéAPI utilizados

| Endpoint | Descripción |
|----------|-------------|
| `GET /pokemon?limit=151` | Lista los primeros 151 pokémon |
| `GET /pokemon/{name}` | Detalles de un pokémon (stats, tipos, habilidades, sprites) |
| `GET /pokemon-species/{id}` | Descripción, género y nombre en español |
| `GET /type/{type}` | Lista de pokémon por tipo para filtrado |

---

## Estructura del proyecto

```
src/
  app/
    pages/
      pokemon-list/
        pokemon-list.page.html    # Template principal (split-panel)
        pokemon-list.page.ts      # Lógica, filtros y carga de datos
        pokemon-list.page.scss    # Estilos del componente
    services/
      pokemon.service.ts          # Todas las llamadas a la PokéAPI
  environments/
    environment.ts
```

---

## Instalación y ejecución local

Requisitos previos: Node.js 18+, npm, Ionic CLI, Android Studio.

```bash
# 1. Clonar el repositorio
git clone https://github.com/jzaldumbide/pokeapp.git
cd pokeapp

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Ejecutar en el navegador
ionic serve
```

La app queda disponible en `http://localhost:8100`.

Para probar en el celular conectado por USB con recarga en vivo:

```bash
ionic capacitor run android --livereload --external
```

---

## Compilacion para Android

```bash
# 1. Generar el build web
ionic build

# 2. Agregar la plataforma Android (solo la primera vez)
npx cap add android

# 3. Sincronizar el build con el proyecto nativo
npx cap sync android

# 4. Abrir en Android Studio
npx cap open android
```

Dentro de Android Studio:
1. `Build > Clean Project`
2. `Build > Build Bundle(s) / APK(s) > Build APK(s)`

El APK de debug se genera en:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

Para instalarlo en el dispositivo via ADB:
```bash
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

Cada vez que se modifique el codigo Angular, repetir:
```bash
ionic build && npx cap sync android
```

---

## Icono y Splash Screen

Los archivos fuente del icono y splash se encuentran en la carpeta `assets/` en la raiz del proyecto:

```
assets/
  icon.png      # 1024x1024 px
  splash.png    # 2732x2732 px
```

Para regenerar los assets despues de cambiar las imagenes:

```bash
npx capacitor-assets generate --android
npx cap sync android
```

Luego recompilar desde Android Studio con `Build > Clean Project` antes de generar el APK.

---

## Configuracion de ADB en Windows

Si `adb` no es reconocido en la terminal, agregar al PATH del sistema:

```
C:\Users\{usuario}\AppData\Local\Android\Sdk\platform-tools
```

O usar la ruta completa directamente:

```bash
& "C:\Users\{usuario}\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r "ruta\al\app-debug.apk"
```

---

## Servicio PokemonService

El servicio centraliza todas las llamadas HTTP e incluye los siguientes metodos:

```typescript
getPokemons(limit, offset)              // Lista paginada
getPokemonDetails(nameOrId)             // Detalle por nombre o ID
getPokemonSpecies(id)                   // Descripcion y metadatos
getPokemonDetailsAndSpecies(name, id)   // Ambas llamadas en paralelo (forkJoin)
getPokemonByType(type)                  // Filtrado por tipo
getSpriteUrl(id, shiny?)               // URL del artwork oficial
getThumbUrl(id)                        // URL de la miniatura
```

---

## Estructura de navegacion

La app usa dos pantallas con navegacion nativa de Ionic:

```
/pokemon-list              # Lista con busqueda y filtros por tipo
/pokemon-detail/:name/:id  # Detalle completo del pokemon seleccionado
```

---

## Capturas de pantalla

<div align="center"> 
  <img width="250"  alt="WhatsApp Image 2026-04-26 at 00 11 23" src="https://github.com/user-attachments/assets/d4c3fa2d-62d1-4956-ae90-b1a9a5464683" />
  <img width="250"  alt="WhatsApp Image 2026-04-26 at 00 11 23 (1)" src="https://github.com/user-attachments/assets/509d3a9a-8e09-4253-8c59-83c826b2bbb3" />
  <img width="250"  alt="WhatsApp Image 2026-04-26 at 00 11 23 (2)" src="https://github.com/user-attachments/assets/d62d20d1-0aa5-4984-8e78-f44c3590ca62" />
  <img width="250"  alt="WhatsApp Image 2026-04-26 at 00 11 22" src="https://github.com/user-attachments/assets/91f3e978-1505-47ad-9672-5bcf3db4f7dd" />
</div>

---

## Notas tecnicas

- El presupuesto de estilos por componente en `angular.json` fue ajustado de 4kb a 16kb para permitir el SCSS de la pantalla principal.
- Se usa `forkJoin` de RxJS para realizar las dos llamadas al detalle y a la especie de forma paralela, reduciendo el tiempo de carga.
- Los sprites se sirven directamente desde el repositorio oficial de PokeAPI en GitHub sin necesidad de almacenamiento propio.
- El filtro por tipo realiza una llamada adicional a `/type/{type}` y cruza los resultados con la lista local para no recargar la lista completa.
- La dependencia obsoleta `@angular/http@7.2.16` fue eliminada del proyecto ya que el codigo usa correctamente `HttpClientModule` de `@angular/common/http`.
