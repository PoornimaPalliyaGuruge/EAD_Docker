using EAD_Assignment.Server.Dtos;
using EAD_Assignment.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;

namespace EAD_Assignment.Server.Controllers
{
    [ApiController]
    [Route("api/requests")]
    public class RoleRequestController : ControllerBase
    {
        private readonly IMongoCollection<Request> _requestCollection;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<RoleRequestController> _logger;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public RoleRequestController(
            IMongoClient mongoClient,
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            ILogger<RoleRequestController> logger)
        {
            var database = mongoClient.GetDatabase("EAD");
            _requestCollection = database.GetCollection<Request>("RoleRequests");
            _userManager = userManager;
            _logger = logger;
            _roleManager = roleManager;
        }

        // Submit a role request (Vendor or CSR)
        [HttpPost("submit")]
        [Authorize]
        public async Task<IActionResult> SubmitRoleRequest([FromBody] RoleRequestDto requestDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            var existingRequest = await _requestCollection.Find(r => r.UserId == userId && r.Status == "Pending").FirstOrDefaultAsync();
            if (existingRequest != null)
            {
                return BadRequest(new { message = "You already have a pending request." });
            }

            var newRequest = new Request
            {
                UserId = user.Id.ToString(),
                UserName = user.FullName,
                Email = user.Email,
                RequestedRole = requestDto.Role,
                Status = "Pending" // Status is pending until admin action
            };

            await _requestCollection.InsertOneAsync(newRequest);

            return Ok(new { message = "Role request submitted successfully." });
        }

        // Fetch all role requests (Admin only)
        [HttpGet]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> GetRoleRequests()
        {
            var requests = await _requestCollection.Find(r => r.Status == "Pending").ToListAsync();
            return Ok(requests);
        }

        // Approve or reject role request (Admin only)
        [HttpPut("{requestId}/approve")]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> ApproveRoleRequest(string requestId, [FromBody] ApproveRequestDto approveDto)
        {
            var request = await _requestCollection.Find(r => r.Id == requestId).FirstOrDefaultAsync();
            if (request == null)
            {
                return NotFound(new { message = "Request not found" });
            }

            request.Status = approveDto.Approve ? "Approved" : "Rejected";
            await _requestCollection.ReplaceOneAsync(r => r.Id == requestId, request);

            if (approveDto.Approve)
            {
                // Assign the role to the user
                var user = await _userManager.FindByIdAsync(request.UserId);
                if (user != null)
                {
                    // Get all current roles of the user
                    var currentRoles = await _userManager.GetRolesAsync(user);

                    // Remove all current roles
                    if (currentRoles.Count > 0)
                    {
                        var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                        if (!removeRolesResult.Succeeded)
                        {
                            return BadRequest(new { message = "Failed to remove existing roles" });
                        }
                    }

                    // Add the new requested role
                    var addRoleResult = await _userManager.AddToRoleAsync(user, request.RequestedRole);
                    if (!addRoleResult.Succeeded)
                    {
                        return BadRequest(new { message = "Failed to assign the new role" });
                    }
                }
            }

            return Ok(new { message = $"Request has been {request.Status.ToLower()}." });
        }

        // Get a user's role request
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserRoleRequest(string userId)
        {
            var request = await _requestCollection.Find(r => r.UserId == userId).FirstOrDefaultAsync();

            if (request == null)
            {
                return NotFound(new { message = "No role request found for this user." });
            }

            return Ok(request);
        }

    }

}
