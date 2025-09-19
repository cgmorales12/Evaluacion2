using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionEventosDeportivos.Models
{
    public class EventoModel
    {
        [Key]
        public int evento_id { get; set; }

        [Required]
        [StringLength(100)]
        public string nombre { get; set; }

        [Required]
        public DateTime fecha { get; set; }

        [Required]
        [StringLength(200)]
        public string ubicacion { get; set; }

        [StringLength(500)]
        public string? descripcion { get; set; }

        // Relación con inscripciones
        public virtual ICollection<InscripcionModel> Inscripciones { get; set; } = new List<InscripcionModel>();
    }
}