using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionEventosDeportivos.Models
{
    public class InscripcionModel
    {
        [Key]
        public int inscripcion_id { get; set; }

        [Required]
        public int evento_id { get; set; }

        [Required]
        public int participante_id { get; set; }

        [Required]
        public DateTime fecha_inscripcion { get; set; } = DateTime.Now;

        [StringLength(20)]
        public string estado { get; set; } = "Activa";

        // Relaciones
        [ForeignKey("evento_id")]
        public virtual EventoModel Evento { get; set; }

        [ForeignKey("participante_id")]
        public virtual ParticipanteModel Participante { get; set; }
    }
}
