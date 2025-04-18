import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpLaravelService } from '../../../http.service';
import { Lugar } from '../home-anunciante/lugar.interface';

@Component({
  selector: 'categoria-vista',
  standalone: false,
  templateUrl: './categoria-vista.component.html',
  styleUrls: ['./categoria-vista.component.scss']
})
export class CategoriaVistaComponent implements OnInit {
  lugares: Lugar[] = [];
  categoriaSeleccionada = '';
  tituloCategoria = '';

  private categoriaMap: { [key: string]: number } = {
    'restaurantes': 1,
    'parques': 2,
    'iglesias': 3,
    'plazas': 4,
    'antros': 5,
    'mercados': 6,
    'supermercados': 7,
    'tiendas': 8,
    'gourmet_urbano': 9
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpLaravelService: HttpLaravelService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const nombreCategoria = params.get('categoria');
      if (nombreCategoria) {
        this.categoriaSeleccionada = nombreCategoria;
        this.tituloCategoria = nombreCategoria.charAt(0).toUpperCase() + nombreCategoria.slice(1);

        const idCategoria = this.categoriaMap[nombreCategoria];
        if (!idCategoria) {
          console.warn('Categoría no encontrada:', nombreCategoria);
          return;
        }

        this.httpLaravelService.Service_Get_Lugares_Publico().subscribe({
          next: (data) => {
            // 👈 Cambio hecho aquí: filtramos por categoría Y por activo
            this.lugares = data.filter(
              (l: Lugar) => l.id_categoria === idCategoria && l.activo
            );
            console.log(`Lugares activos para '${nombreCategoria}':`, this.lugares);
          },
          error: (err) => {
            console.error('Error al cargar lugares públicos:', err);
          }
        });
      }
    });
  }

  vistaDetalladaDestino(id: number | string) {
    const idEntero = parseInt(id.toString(), 10);
    if (isNaN(idEntero)) {
      console.error('ID inválido:', id);
      return;
    }
    this.router.navigate(['/vista-detallada-destino', idEntero]);
  }
}
