using System;
using GestionEventosDeportivos.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GestionEventosDeportivos.Migrations
{
    [DbContext(typeof(EventosDbContext))]
    [Migration("20240601000000_MakeEventoDescripcionOptional")]
    partial class MakeEventoDescripcionOptional
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.20")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("GestionEventosDeportivos.Models.EventoModel", b =>
                {
                    b.Property<int>("evento_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("evento_id"));

                    b.Property<string>("descripcion")
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<DateTime>("fecha")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("nombre")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("ubicacion")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("varchar(200)");

                    b.HasKey("evento_id");

                    b.ToTable("Eventos", (string)null);
                });

            modelBuilder.Entity("GestionEventosDeportivos.Models.InscripcionModel", b =>
                {
                    b.Property<int>("inscripcion_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("inscripcion_id"));

                    b.Property<string>("estado")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)")
                        .HasDefaultValue("Activa");

                    b.Property<int>("evento_id")
                        .HasColumnType("int");

                    b.Property<DateTime>("fecha_inscripcion")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("participante_id")
                        .HasColumnType("int");

                    b.HasKey("inscripcion_id");

                    b.HasIndex("participante_id");

                    b.HasIndex("evento_id", "participante_id")
                        .IsUnique();

                    b.ToTable("Inscripciones", (string)null);
                });

            modelBuilder.Entity("GestionEventosDeportivos.Models.ParticipanteModel", b =>
                {
                    b.Property<int>("participante_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("participante_id"));

                    b.Property<string>("apellido")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("nombre")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("telefono")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("varchar(15)");

                    b.HasKey("participante_id");

                    b.HasIndex("email")
                        .IsUnique();

                    b.ToTable("Participantes", (string)null);
                });

            modelBuilder.Entity("GestionEventosDeportivos.Models.InscripcionModel", b =>
                {
                    b.HasOne("GestionEventosDeportivos.Models.EventoModel", "Evento")
                        .WithMany("Inscripciones")
                        .HasForeignKey("evento_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GestionEventosDeportivos.Models.ParticipanteModel", "Participante")
                        .WithMany("Inscripciones")
                        .HasForeignKey("participante_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Evento");

                    b.Navigation("Participante");
                });

            modelBuilder.Entity("GestionEventosDeportivos.Models.EventoModel", b =>
                {
                    b.Navigation("Inscripciones");
                });

            modelBuilder.Entity("GestionEventosDeportivos.Models.ParticipanteModel", b =>
                {
                    b.Navigation("Inscripciones");
                });
#pragma warning restore 612, 618
        }
    }
}
