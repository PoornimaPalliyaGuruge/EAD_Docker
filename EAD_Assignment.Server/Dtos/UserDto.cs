namespace EAD_Assignment.Server.Dtos
{
    public class UserDto
    {
        public string UserId { get; set; } 
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string NIC { get; set; }
        public IList<string> Roles { get; set; } 
    }


}
