using System;
using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionCreatedFaultConsumer : IConsumer<Fault<AuctionCreated>>
{
    public async Task Consume(ConsumeContext<Fault<AuctionCreated>> context)
    {
        // handle exception of saving auction in search db 
        Console.WriteLine("====> Consuming faulty auction creation.");
        Console.WriteLine($"====> Exception: {context.Message.Exceptions.First()}");
        Console.WriteLine($"====> Auction {context.Message.Message}");
    }
}
