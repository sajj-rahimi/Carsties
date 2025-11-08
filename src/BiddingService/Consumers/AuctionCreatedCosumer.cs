using BiddingService.Models;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace BiddingService.Consumers;

public class AuctionCreatedCosumer : IConsumer<AuctionCreated>
{
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        var auction = new Auction
        {
            ID = context.Message.Id.ToString(),
            AutionEnd = context.Message.AuctionEnd,
            Seller = context.Message.Seller,
            ReservePrice = context.Message.ReservePrice,
        };

        await DB.SaveAsync(auction);
    }
}