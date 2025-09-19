import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InscripcionService } from '../../services/inscripcion.service';
import { EventoService } from '../../services/evento.service';
import { ParticipanteService } from '../../services/participante.service';
import { CreateInscripcion, Inscripcion } from '../../models/inscripcion.model';
import { Evento } from '../../models/evento.model';
import { Participante } from '../../models/participante.model';

type AlertType = 'success' | 'danger';

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inscripciones.html',
  styleUrls: ['./inscripciones.css']
})
export class InscripcionesComponent implements OnInit {
  inscripciones: Inscripcion[] = [];
  filteredInscripciones: Inscripcion[] = [];
  eventos: Evento[] = [];
  participantes: Participante[] = [];
  createForm: FormGroup;
  filterForm: FormGroup;
  loading = false;
  message: { type: AlertType; text: string } | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly inscripcionService: InscripcionService,
    private readonly eventoService: EventoService,
    private readonly participanteService: ParticipanteService
  ) {
    this.createForm = this.fb.group({
      evento_id: ['', Validators.required],
      participante_id: ['', Validators.required]
    });

    this.filterForm = this.fb.group({
      evento_id: [''],
      participante_id: [''],
      estado: ['']
    });

    this.filterForm.valueChanges.subscribe(() => this.aplicarFiltros());
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales(): void {
    this.cargarEventos();
    this.cargarParticipantes();
    this.cargarInscripciones();
  }

  private cargarEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
      }
    });
  }

  private cargarParticipantes(): void {
    this.participanteService.getParticipantes().subscribe({
      next: (participantes) => {
        this.participantes = participantes;
      }
    });
  }

  cargarInscripciones(): void {
    this.loading = true;
    this.inscripcionService.getInscripciones().subscribe({
      next: (inscripciones) => {
        this.inscripciones = inscripciones;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.mostrarMensaje('danger', 'No se pudieron cargar las inscripciones. Intente nuevamente.');
      }
    });
  }

  submit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const formValue = this.createForm.value;
    const payload: CreateInscripcion = {
      evento_id: Number(formValue.evento_id),
      participante_id: Number(formValue.participante_id)
    };

    this.inscripcionService.createInscripcion(payload).subscribe({
      next: (inscripcionCreada) => {
        this.inscripciones = [...this.inscripciones, inscripcionCreada];
        this.aplicarFiltros();
        this.createForm.reset({ evento_id: '', participante_id: '' });
        this.createForm.markAsPristine();
        this.createForm.markAsUntouched();
        this.mostrarMensaje('success', 'Inscripción creada correctamente.');
      },
      error: (error) => {
        const message = typeof error.error === 'string'
          ? error.error
          : 'No se pudo crear la inscripción. Intente nuevamente.';
        this.mostrarMensaje('danger', message);
      }
    });
  }

  actualizarEstado(inscripcion: Inscripcion, nuevoEstado: string): void {
    if (inscripcion.estado === nuevoEstado) {
      return;
    }

    this.inscripcionService.updateInscripcion(inscripcion.inscripcion_id, { estado: nuevoEstado }).subscribe({
      next: () => {
        const index = this.inscripciones.findIndex(i => i.inscripcion_id === inscripcion.inscripcion_id);
        if (index > -1) {
          this.inscripciones[index] = {
            ...this.inscripciones[index],
            estado: nuevoEstado
          };
          this.aplicarFiltros();
        }
        this.mostrarMensaje('success', 'Estado actualizado correctamente.');
      },
      error: () => {
        this.mostrarMensaje('danger', 'No se pudo actualizar el estado de la inscripción.');
      }
    });
  }

  eliminarInscripcion(inscripcion: Inscripcion): void {
    const confirmar = window.confirm(`¿Desea eliminar la inscripción de ${inscripcion.participante_nombre_completo}?`);
    if (!confirmar) {
      return;
    }

    this.inscripcionService.deleteInscripcion(inscripcion.inscripcion_id).subscribe({
      next: () => {
        this.inscripciones = this.inscripciones.filter(i => i.inscripcion_id !== inscripcion.inscripcion_id);
        this.aplicarFiltros();
        this.mostrarMensaje('success', 'Inscripción eliminada correctamente.');
      },
      error: () => {
        this.mostrarMensaje('danger', 'No se pudo eliminar la inscripción. Intente nuevamente.');
      }
    });
  }

  limpiarFiltros(): void {
    this.filterForm.reset({ evento_id: '', participante_id: '', estado: '' });
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    const { evento_id, participante_id, estado } = this.filterForm.value;

    let resultado = [...this.inscripciones];

    if (evento_id) {
      resultado = resultado.filter(i => i.evento_id === Number(evento_id));
    }

    if (participante_id) {
      resultado = resultado.filter(i => i.participante_id === Number(participante_id));
    }

    if (estado) {
      resultado = resultado.filter(i => i.estado === estado);
    }

    this.filteredInscripciones = resultado.sort((a, b) =>
      new Date(b.fecha_inscripcion).getTime() - new Date(a.fecha_inscripcion).getTime()
    );
  }

  private mostrarMensaje(type: AlertType, text: string): void {
    this.message = { type, text };
    setTimeout(() => {
      if (this.message?.text === text) {
        this.message = null;
      }
    }, 5000);
  }

  get eventoId() {
    return this.createForm.get('evento_id');
  }

  get participanteId() {
    return this.createForm.get('participante_id');
  }
}
