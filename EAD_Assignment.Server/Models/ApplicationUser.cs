using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;
using System;

namespace EAD_Assignment.Server.Models
{
    [CollectionName("users")]
    public class ApplicationUser : MongoIdentityUser<Guid>
    {
        //Full name
        public string FullName { get; set; } = string.Empty;

        //NIC number
        public string NIC { get; set; } = string.Empty;
    }
}
