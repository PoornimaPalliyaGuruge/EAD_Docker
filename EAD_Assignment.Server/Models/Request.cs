using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace EAD_Assignment.Server.Models
{
    public class Request
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string RequestedRole { get; set; }
        public string Status { get; set; } = "Pending"; 
    }
}
