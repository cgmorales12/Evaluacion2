import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParticipanteService } from '../../services/participante.service';
import { Participante, CreateParticipante, UpdateParticipante } from '../../models/participante.model';

type AlertType = 'success' | 'danger';

@Component({
  selector: 'app-participantes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './participantes.html',
  styleUrls: ['./participantes.css']
})
export class ParticipantesComponent implements OnInit {
  participantes: Participante[] = [];
  participanteForm: FormGroup;
  isEditing = false;
  selectedParticipanteId: number | null = null;
  loading = false;
  message: { type: AlertType; text: string } | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly participanteService: ParticipanteService
  ) {
    this.participanteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefono: ['', [Validators.maxLength(15)]]
    });
  }

  ngOnInit(): void {
    this.cargarParticipantes();
  }

  cargarParticipantes(): void {
    this.loading = true;
    this.participanteService.getParticipantes().subscribe({
      next: (participantes) => {
        this.participantes = [...participantes].sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.mostrarMensaje('danger', 'No se pudieron cargar los participantes. Intente nuevamente.');
      }
    });
  }

  submit(): void {
    if (this.participanteForm.invalid) {
      this.participanteForm.markAllAsTouched();
      return;
    }

    const formValue = this.participanteForm.value;
    const payload: CreateParticipante | UpdateParticipante = {
      nombre: formValue.nombre.trim(),
      apellido: formValue.apellido.trim(),
      email: formValue.email.trim().toLowerCase(),
      telefono: formValue.telefono ? formValue.telefono.trim() : ''
    };

    if (this.isEditing && this.selectedParticipanteId !== null) {
      this.actualizarParticipante(payload as UpdateParticipante);
    } else {
      this.crearParticipante(payload as CreateParticipante);
    }
  }

  private crearParticipante(payload: CreateParticipante): void {
    this.participanteService.createParticipante(payload).subscribe({
      next: (participanteCreado) => {
        this.participantes = [...this.participantes, participanteCreado].sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );
        this.participanteForm.reset();
        this.participanteForm.markAsPristine();
        this.participanteForm.markAsUntouched();
        this.mostrarMensaje('success', 'Participante creado correctamente.');
      },
      error: (error) => {
        const message = typeof error.error === 'string'
          ? error.error
          : 'No se pudo crear el participante. Intente nuevamente.';
        this.mostrarMensaje('danger', message);
      }
    });
  }

  private actualizarParticipante(payload: UpdateParticipante): void {
    if (this.selectedParticipanteId === null) {
      return;
    }

    this.participanteService.updateParticipante(this.selectedParticipanteId, payload).subscribe({
      next: () => {
        const index = this.participantes.findIndex(p => p.participante_id === this.selectedParticipanteId);
       if (index > -1) {
         this.participantes[index] = {
           ...this.participantes[index],
            ...payload,
            nombre_completo: `${payload.nombre} ${payload.apellido}`
          } as Participante;
          this.participantes = [...this.participantes].sort((a, b) => a.nombre.localeCompare(b.nombre));
        }
        this.mostrarMensaje('success', 'Participante actualizado correctamente.');
        this.cancelarEdicion();
      },
      error: (error) => {
        const message = typeof error.error === 'string'
          ? error.error
          : 'No se pudo actualizar el participante. Intente nuevamente.';
        this.mostrarMensaje('danger', message);
      }
    });
  }

  editarParticipante(participante: Participante): void {
    this.isEditing = true;
    this.selectedParticipanteId = participante.participante_id;
    this.participanteForm.patchValue({
      nombre: participante.nombre,
      apellido: participante.apellido,
      email: participante.email,
      telefono: participante.telefono ?? ''
    });
  }

  cancelarEdicion(): void {
    this.isEditing = false;
    this.selectedParticipanteId = null;
    this.participanteForm.reset();
    this.participanteForm.markAsPristine();
    this.participanteForm.markAsUntouched();
  }

  eliminarParticipante(participante: Participante): void {
    const confirmar = window.confirm(`¿Desea eliminar a ${participante.nombre} ${participante.apellido}?`);
    if (!confirmar) {
      return;
    }

    this.participanteService.deleteParticipante(participante.participante_id).subscribe({
      next: () => {
        this.participantes = this.participantes.filter(p => p.participante_id !== participante.participante_id);
        this.mostrarMensaje('success', 'Participante eliminado correctamente.');
      },
      error: () => {
        this.mostrarMensaje('danger', 'No se pudo eliminar el participante. Intente nuevamente.');
      }
    });
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
    return this.participanteForm.get('nombre');
  }

  get apellido() {
    return this.participanteForm.get('apellido');
  }

  get email() {
    return this.participanteForm.get('email');
  }

  get telefono() {
    return this.participanteForm.get('telefono');
  }
}
