namespace EAD_Assignment.Server.Dtos
{
    public class UpdateUserRequest
    {
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }

}
