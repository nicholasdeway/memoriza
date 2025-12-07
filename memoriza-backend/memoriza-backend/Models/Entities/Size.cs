namespace memoriza_backend.Models.Entities
{
    public class Size
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; } = true;
    }
}
