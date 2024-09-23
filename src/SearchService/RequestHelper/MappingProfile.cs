using AutoMapper;
using Contracts;

namespace SearchService.RequestHelper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<AuctionCreated, Item>();
        CreateMap<AuctionUpdated, Item>();
    }
}
