using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace EAD_Assignment.Server.Dtos
{
    public class ProductDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public string CategoryId { get; set; }
        public IFormFile Image { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public int WarningLimit { get; set; }
    }
}