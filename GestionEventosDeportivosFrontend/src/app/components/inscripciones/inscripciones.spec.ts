import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InscripcionesComponent } from './inscripciones';
import { InscripcionService } from '../../services/inscripcion.service';
import { EventoService } from '../../services/evento.service';
import { ParticipanteService } from '../../services/participante.service';

describe('InscripcionesComponent', () => {
  let component: InscripcionesComponent;
  let fixture: ComponentFixture<InscripcionesComponent>;
  let inscripcionServiceSpy: jasmine.SpyObj<InscripcionService>;
  let eventoServiceSpy: jasmine.SpyObj<EventoService>;
  let participanteServiceSpy: jasmine.SpyObj<ParticipanteService>;

  beforeEach(async () => {
    inscripcionServiceSpy = jasmine.createSpyObj('InscripcionService', [
      'getInscripciones',
      'createInscripcion',
      'updateInscripcion',
      'deleteInscripcion'
    ]);
    eventoServiceSpy = jasmine.createSpyObj('EventoService', ['getEventos']);
    participanteServiceSpy = jasmine.createSpyObj('ParticipanteService', ['getParticipantes']);

    inscripcionServiceSpy.getInscripciones.and.returnValue(of([]));
    inscripcionServiceSpy.createInscripcion.and.returnValue(of({
      inscripcion_id: 1,
      evento_id: 1,
      participante_id: 1,
      fecha_inscripcion: new Date(),
      estado: 'Activa',
      evento_nombre: 'Evento Test',
      participante_nombre_completo: 'Nombre Apellido'
    }));
    inscripcionServiceSpy.updateInscripcion.and.returnValue(of(null));
    inscripcionServiceSpy.deleteInscripcion.and.returnValue(of(null));
    eventoServiceSpy.getEventos.and.returnValue(of([]));
    participanteServiceSpy.getParticipantes.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [InscripcionesComponent],
      providers: [
        { provide: InscripcionService, useValue: inscripcionServiceSpy },
        { provide: EventoService, useValue: eventoServiceSpy },
        { provide: ParticipanteService, useValue: participanteServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
