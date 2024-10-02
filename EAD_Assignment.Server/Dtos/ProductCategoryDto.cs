using System.ComponentModel.DataAnnotations;

namespace EAD_Assignment.Server.Dtos
{
    public class ProductCategoryDto
    {
        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        public bool IsActivated { get; set; } = true;
    }
}
