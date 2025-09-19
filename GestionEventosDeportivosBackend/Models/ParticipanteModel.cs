using System.ComponentModel.DataAnnotations;

namespace GestionEventosDeportivos.Models
{
    public class ParticipanteModel
    {
        [Key]
        public int participante_id { get; set; }

        [Required]
        [StringLength(50)]
        public string nombre { get; set; }

        [Required]
        [StringLength(50)]
        public string apellido { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string email { get; set; }

        [StringLength(15)]
        public string telefono { get; set; }

        // Relación con inscripciones
        public virtual ICollection<InscripcionModel> Inscripciones { get; set; } = new List<InscripcionModel>();
    }
}