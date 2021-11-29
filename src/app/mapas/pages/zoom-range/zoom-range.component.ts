import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container {
        width: 100%;
        height: 100%;
      }

      .row {
        background-color: white;
        position: fixed;
        bottom: 50px;
        left: 50px;
        width: 400px;
        padding: 10px;
        border-radius: 5px;
        z-index: 999;
      }
    `,
  ],
})
export class ZoomRangeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;

  zoomMaximo = 18;
  zoomMinimo = 8;

  centro: [number, number] = [-6.075163876651878, 37.40867416969071];

  constructor() {}

  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centro,
      zoom: this.zoomLevel,
    });

    this.mapa.on('zoom', () => {
      this.zoomLevel = this.mapa.getZoom();
    });

    this.mapa.on('zoomend', () => {
      if (this.mapa.getZoom() > this.zoomMaximo)
        this.mapa.zoomTo(this.zoomMaximo);
      if (this.mapa.getZoom() < this.zoomMinimo)
        this.mapa.zoomTo(this.zoomMinimo);
    });

    this.mapa.on('move', (evento) => {
      const { lng, lat } = evento.target.getCenter();
      this.centro = [lng, lat];
    });
  }

  ngOnInit(): void {}

  zoomOut() {
    this.mapa.zoomOut();
  }
  zoomIn() {
    this.mapa.zoomIn();
  }
  zoomChanged(zoom: string) {
    this.mapa.zoomTo(Number(zoom));
  }
}
