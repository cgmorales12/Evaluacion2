import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EventosComponent } from './eventos';
import { EventoService } from '../../services/evento.service';

describe('EventosComponent', () => {
  let component: EventosComponent;
  let fixture: ComponentFixture<EventosComponent>;
  let eventoServiceSpy: jasmine.SpyObj<EventoService>;

  beforeEach(async () => {
    eventoServiceSpy = jasmine.createSpyObj('EventoService', ['getEventos', 'createEvento', 'updateEvento', 'deleteEvento']);
    eventoServiceSpy.getEventos.and.returnValue(of([]));
    eventoServiceSpy.createEvento.and.returnValue(of({
      evento_id: 1,
      nombre: 'Evento Test',
      fecha: new Date(),
      ubicacion: 'Ubicación',
      descripcion: 'Descripción',
      total_participantes: 0
    }));
    eventoServiceSpy.updateEvento.and.returnValue(of(null));
    eventoServiceSpy.deleteEvento.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [EventosComponent],
      providers: [{ provide: EventoService, useValue: eventoServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(EventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
