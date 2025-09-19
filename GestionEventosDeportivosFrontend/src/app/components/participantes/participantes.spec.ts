import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ParticipantesComponent } from './participantes';
import { ParticipanteService } from '../../services/participante.service';

describe('ParticipantesComponent', () => {
  let component: ParticipantesComponent;
  let fixture: ComponentFixture<ParticipantesComponent>;
  let participanteServiceSpy: jasmine.SpyObj<ParticipanteService>;

  beforeEach(async () => {
    participanteServiceSpy = jasmine.createSpyObj('ParticipanteService', [
      'getParticipantes',
      'createParticipante',
      'updateParticipante',
      'deleteParticipante'
    ]);

    participanteServiceSpy.getParticipantes.and.returnValue(of([]));
    participanteServiceSpy.createParticipante.and.returnValue(of({
      participante_id: 1,
      nombre: 'Nombre',
      apellido: 'Apellido',
      email: 'correo@correo.com',
      telefono: '123456789',
      nombre_completo: 'Nombre Apellido'
    }));
    participanteServiceSpy.updateParticipante.and.returnValue(of(null));
    participanteServiceSpy.deleteParticipante.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [ParticipantesComponent],
      providers: [{ provide: ParticipanteService, useValue: participanteServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
