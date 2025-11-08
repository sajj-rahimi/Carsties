using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace SearchService.Cosumers
{
    public class BidPlacedConsumer : IConsumer<BidPlaced>
    {
        public async Task Consume(ConsumeContext<BidPlaced> context)
        {
            Console.WriteLine("========> Consuming BidPlaced Event");

            var auction = await DB.Find<Item>().OneAsync(context.Message.AuctionID);

            if (
                auction != null &&
                context.Message.Status.Contains("Accepted") &&
                context.Message.Amount > auction.CurrentHighBid)
            {
                auction.CurrentHighBid = context.Message.Amount;
                await auction.SaveAsync();
            }
        }
    }
}