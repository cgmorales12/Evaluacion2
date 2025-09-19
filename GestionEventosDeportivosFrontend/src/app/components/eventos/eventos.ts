import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventoService } from '../../services/evento.service';
import { Evento, CreateEvento, UpdateEvento } from '../../models/evento.model';

type AlertType = 'success' | 'danger';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './eventos.html',
  styleUrls: ['./eventos.css']
})
export class EventosComponent implements OnInit {
  eventos: Evento[] = [];
  eventoForm: FormGroup;
  isEditing = false;
  selectedEventoId: number | null = null;
  loading = false;
  message: { type: AlertType; text: string } | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly eventoService: EventoService
  ) {
    this.eventoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      fecha: ['', Validators.required],
      ubicacion: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.loading = true;
    this.eventoService.getEventos().subscribe({
      next: (eventos) => {
        this.eventos = [...eventos].sort((a, b) =>
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.mostrarMensaje('danger', 'No se pudieron cargar los eventos. Intente nuevamente.');
      }
    });
  }

  submit(): void {
    if (this.eventoForm.invalid) {
      this.eventoForm.markAllAsTouched();
      return;
    }

    const formValue = this.eventoForm.value;
    const payload: CreateEvento | UpdateEvento = {
      nombre: formValue.nombre.trim(),
      fecha: new Date(formValue.fecha),
      ubicacion: formValue.ubicacion.trim(),
      descripcion: formValue.descripcion ? formValue.descripcion.trim() : null
    };

    if (this.isEditing && this.selectedEventoId !== null) {
      this.actualizarEvento(payload as UpdateEvento);
    } else {
      this.crearEvento(payload as CreateEvento);
    }
  }

  private crearEvento(payload: CreateEvento): void {
    this.eventoService.createEvento(payload).subscribe({
      next: (eventoCreado) => {
        this.eventos = [...this.eventos, eventoCreado].sort((a, b) =>
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
        this.eventoForm.reset();
        this.eventoForm.markAsPristine();
        this.eventoForm.markAsUntouched();
        this.mostrarMensaje('success', 'Evento creado correctamente.');
      },
      error: () => {
        this.mostrarMensaje('danger', 'No se pudo crear el evento. Intente nuevamente.');
      }
    });
  }

  private actualizarEvento(payload: UpdateEvento): void {
    if (this.selectedEventoId === null) {
      return;
    }

    this.eventoService.updateEvento(this.selectedEventoId, payload).subscribe({
      next: () => {
        const index = this.eventos.findIndex(e => e.evento_id === this.selectedEventoId);
       if (index > -1) {
         this.eventos[index] = {
           ...this.eventos[index],
           ...payload,
            fecha: payload.fecha,
            total_participantes: this.eventos[index].total_participantes
          } as Evento;
          this.eventos = [...this.eventos].sort((a, b) =>
            new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
          );
        }
        this.mostrarMensaje('success', 'Evento actualizado correctamente.');
        this.cancelarEdicion();
      },
      error: () => {
        this.mostrarMensaje('danger', 'No se pudo actualizar el evento. Intente nuevamente.');
      }
    });
  }

  editarEvento(evento: Evento): void {
    this.isEditing = true;
    this.selectedEventoId = evento.evento_id;
    this.eventoForm.patchValue({
      nombre: evento.nombre,
      fecha: this.obtenerFechaInput(evento.fecha),
      ubicacion: evento.ubicacion,
      descripcion: evento.descripcion ?? ''
    });
  }

  cancelarEdicion(): void {
    this.isEditing = false;
    this.selectedEventoId = null;
    this.eventoForm.reset();
    this.eventoForm.markAsPristine();
    this.eventoForm.markAsUntouched();
  }

  eliminarEvento(evento: Evento): void {
    const confirmar = window.confirm(`¿Desea eliminar el evento "${evento.nombre}"?`);
    if (!confirmar) {
      return;
    }

    this.eventoService.deleteEvento(evento.evento_id).subscribe({
      next: () => {
        this.eventos = this.eventos.filter(e => e.evento_id !== evento.evento_id);
        this.mostrarMensaje('success', 'Evento eliminado correctamente.');
      },
      error: () => {
        this.mostrarMensaje('danger', 'No se pudo eliminar el evento. Intente nuevamente.');
      }
    });
  }

  private obtenerFechaInput(fecha: Date): string {
    return new Date(fecha).toISOString().split('T')[0];
  }

  private mostrarMensaje(type: AlertType, text: string): void {
    this.message = { type, text };
    setTimeout(() => {
      if (this.message?.text === text) {
        this.message = null;
      }
    }, 5000);
  }

  get nombre() {
    return this.eventoForm.get('nombre');
  }

  get fecha() {
    return this.eventoForm.get('fecha');
  }

  get ubicacion() {
    return this.eventoForm.get('ubicacion');
  }

  get descripcion() {
    return this.eventoForm.get('descripcion');
  }
}
