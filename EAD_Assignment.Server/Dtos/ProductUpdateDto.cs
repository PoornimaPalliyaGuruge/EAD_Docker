using Microsoft.AspNetCore.Http;

namespace EAD_Assignment.Server.Dtos
{
    public class ProductUpdateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal? Price { get; set; }
        public string CategoryId { get; set; }
        public int? Quantity { get; set; }
        public int? WarningLimit { get; set; }
    }

}

