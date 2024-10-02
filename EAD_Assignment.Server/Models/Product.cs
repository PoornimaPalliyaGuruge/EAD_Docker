using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EAD_Assignment.Server.Models
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("productId")]
        public string ProductId { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }

        [BsonElement("price")]
        public decimal Price { get; set; }

        [BsonElement("image")]
        public string Image { get; set; }

        [BsonElement("categoryId")]
        public string CategoryId { get; set; }
        public string CategoryName { get; set; }

        [BsonElement("vendorId")]
        public string VendorId { get; set; }

        [BsonElement("quantity")]
        public int Quantity { get; set; }

        [BsonElement("warningLimit")]
        public int WarningLimit { get; set; }
    }
}
