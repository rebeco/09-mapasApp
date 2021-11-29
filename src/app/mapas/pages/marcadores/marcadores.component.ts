import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marcador?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        width: 100%;
        height: 100%;
      }

      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
      }

      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MarcadoresComponent implements OnInit, AfterViewInit {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;

  centro: [number, number] = [-6.075163876651878, 37.40867416969071];

  marcadores: MarcadorColor[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centro,
      zoom: this.zoomLevel,
    });

    this.leerMarcadores();

    //const markerHtml: HTMLElement = document.createElement('div');
    //markerHtml.innerHTML = 'Hola Mundo';

    // const marker = new mapboxgl.Marker({ element: markerHtml })
    //   .setLngLat(this.centro)
    //   .addTo(this.mapa);
  }

  irMarcador(marcador: mapboxgl.Marker) {
    this.mapa.flyTo({ center: marcador.getLngLat() });
  }

  agregarMarcador() {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    const nuevoMarcador = new mapboxgl.Marker({ draggable: true, color: color })
      .setLngLat(this.centro)
      .addTo(this.mapa);

    this.marcadores.push({ color: color, marcador: nuevoMarcador });

    this.guardarMarcadores();

    nuevoMarcador.on('dragend', () => {
      console.log('dd');
      this.guardarMarcadores();
    });
  }

  guardarMarcadores() {
    const lngLatArr: MarcadorColor[] = [];

    this.marcadores.forEach((m) => {
      const color = m.color;
      const { lng, lat } = m.marcador!.getLngLat();
      lngLatArr.push({
        color: color,
        centro: [lng, lat],
      });
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  leerMarcadores() {
    if (!localStorage.getItem('marcadores')) return;

    const lngLatArr: MarcadorColor[] = JSON.parse(
      localStorage.getItem('marcadores')!
    );

    lngLatArr.forEach((m) => {
      const nuevoMarcador = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa);

      this.marcadores.push({
        color: m.color,
        marcador: nuevoMarcador,
        centro: m.centro,
      });

      nuevoMarcador.on('dragend', () => {
        console.log('aa');
        this.guardarMarcadores();
      });
    });
  }

  borrarMarcador(i: number) {
    this.marcadores[i].marcador?.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadores();
  }
}
