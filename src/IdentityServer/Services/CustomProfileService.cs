using System;
using System.Security.Claims;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using IdentityModel;
using IdentityServer.Models;
using Microsoft.AspNetCore.Identity;

namespace IdentityServer.Services;

public class CustomProfileService : IProfileService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public CustomProfileService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }
    public async Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var user = await _userManager.GetUserAsync(context.Subject);
        var existingClaims = await _userManager.GetClaimsAsync(user);
        var claims = new Claim[]{
            new("username", user.UserName)
        };
        context.IssuedClaims.AddRange(existingClaims);
        context.IssuedClaims.Add(existingClaims.FirstOrDefault(x => JwtClaimTypes.Name == x.Type));
    }

    public Task IsActiveAsync(IsActiveContext context)
    {
        return Task.CompletedTask;
    }
}
