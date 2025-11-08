using AutoMapper;
using BiddingService.DTOs;
using BiddingService.Models;

namespace BiddingService.RequestHelpers;

public class MappingProfiles : Profile
{
    protected MappingProfiles()
    {
        CreateMap<Bid, BidDTO>();
        CreateMap<Bid, BidPlaced>();
    }
}