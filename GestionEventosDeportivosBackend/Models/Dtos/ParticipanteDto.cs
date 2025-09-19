namespace GestionEventosDeportivos.Models.Dtos
{
    public class ParticipanteDto
    {
        public int participante_id { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string email { get; set; }
        public string telefono { get; set; }
        public string nombre_completo => $"{nombre} {apellido}";
    }

    public class CreateParticipanteDto
    {
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string email { get; set; }
        public string telefono { get; set; }
    }

    public class UpdateParticipanteDto
    {
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string email { get; set; }
        public string telefono { get; set; }
    }
}





