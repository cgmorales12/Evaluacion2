using System;
using System.ComponentModel.DataAnnotations;

namespace GestionEventosDeportivos.Models
{
    public class CitaModel
    {
        [Key]
        public int cita_id { get; set; }

        [Required]
        public DateTime fecha_cita { get; set; }

        [Required]
        public TimeSpan hora_inicio { get; set; }

        [Required]
        public TimeSpan hora_fin { get; set; }

        [StringLength(200)]
        public string? motivo { get; set; }
    }
}
