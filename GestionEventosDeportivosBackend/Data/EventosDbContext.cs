using GestionEventosDeportivos.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace GestionEventosDeportivos.Data
{
    public class EventosDbContext : DbContext
    {
        public EventosDbContext(DbContextOptions<EventosDbContext> options) : base(options)
        {
        }

        // DbSets para las tablas
        public DbSet<EventoModel> Eventos { get; set; }
        public DbSet<ParticipanteModel> Participantes { get; set; }
        public DbSet<InscripcionModel> Inscripciones { get; set; }
        public DbSet<CitaModel> Citas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de la tabla Eventos
            modelBuilder.Entity<EventoModel>(entity =>
            {
                entity.ToTable("Eventos");
                entity.HasKey(e => e.evento_id);
                entity.Property(e => e.nombre).IsRequired().HasMaxLength(100);
                entity.Property(e => e.ubicacion).IsRequired().HasMaxLength(200);
                entity.Property(e => e.descripcion)
                      .HasMaxLength(500)
                      .IsRequired(false);
            });

            // Configuración de la tabla Participantes
            modelBuilder.Entity<ParticipanteModel>(entity =>
            {
                entity.ToTable("Participantes");
                entity.HasKey(p => p.participante_id);
                entity.Property(p => p.nombre).IsRequired().HasMaxLength(50);
                entity.Property(p => p.apellido).IsRequired().HasMaxLength(50);
                entity.Property(p => p.email).IsRequired().HasMaxLength(100);
                entity.Property(p => p.telefono).HasMaxLength(15);

                // Índice único para email
                entity.HasIndex(p => p.email).IsUnique();
            });

            // Configuración de la tabla Inscripciones
            modelBuilder.Entity<InscripcionModel>(entity =>
            {
                entity.ToTable("Inscripciones");
                entity.HasKey(i => i.inscripcion_id);
                entity.Property(i => i.estado).HasMaxLength(20).HasDefaultValue("Activa");

                // Relaciones
                entity.HasOne(i => i.Evento)
                      .WithMany(e => e.Inscripciones)
                      .HasForeignKey(i => i.evento_id)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(i => i.Participante)
                      .WithMany(p => p.Inscripciones)
                      .HasForeignKey(i => i.participante_id)
                      .OnDelete(DeleteBehavior.Cascade);

                // Evitar inscripciones duplicadas (mismo participante en mismo evento)
                entity.HasIndex(i => new { i.evento_id, i.participante_id }).IsUnique();
            });

            // Configuración de la tabla Citas
            modelBuilder.Entity<CitaModel>(entity =>
            {
                entity.ToTable("Citas");
                entity.HasKey(c => c.cita_id);
                entity.Property(c => c.fecha_cita).HasColumnType("date").IsRequired();
                entity.Property(c => c.hora_inicio).HasColumnType("time(6)").IsRequired();
                entity.Property(c => c.hora_fin).HasColumnType("time(6)").IsRequired();
                entity.Property(c => c.motivo).HasMaxLength(200);
                entity.HasIndex(c => new { c.fecha_cita, c.hora_inicio }).IsUnique();
            });
        }
    }
}
