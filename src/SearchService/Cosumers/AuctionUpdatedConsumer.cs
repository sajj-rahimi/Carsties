using System;
using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace SearchService.Cosumers;

public class AuctionUpdatedConsumer : IConsumer<AuctionUpdated>
{
    private readonly IMapper mapper;
    public AuctionUpdatedConsumer(IMapper mapper)
    {
        this.mapper = mapper;
    }
    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        var item = mapper.Map<Item>(context.Message);
        var result = await DB.Update<Item>()
            .Match(a => a.ID == context.Message.ID)
            .ModifyOnly(x =>
                new
                {
                    x.Color,
                    x.Make,
                    x.Model,
                    x.Year,
                    x.Mileage
                },
                item
            )
            .ExecuteAsync();

        if (!result.IsAcknowledged)
            throw new MessageException(typeof(AuctionCreated), "Exception updating mongodb");
    }
}
