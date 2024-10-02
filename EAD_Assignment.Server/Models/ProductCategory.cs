using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EAD_Assignment.Server.Models
{
    public class ProductCategory
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }

        [BsonElement("isActivated")]
        public bool IsActivated { get; set; }
    }
}
