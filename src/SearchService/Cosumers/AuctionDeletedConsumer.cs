using System;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace SearchService.Cosumers;

public class AuctionDeletedConsumer : IConsumer<AuctionDeleted>
{
    public async Task Consume(ConsumeContext<AuctionDeleted> context)
    {
        var result = await DB.DeleteAsync<Item>(context.Message.ID);

        if (!result.IsAcknowledged)
            throw new MessageException(typeof(AuctionDeleted), "Exception deleting auction");
    }
}
