using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;
using System.Runtime.Serialization;

namespace EAD_Assignment.Server.Models
{
    [CollectionName("roles")]
    public class ApplicationRole : MongoIdentityRole<Guid>
    {

    }
}
