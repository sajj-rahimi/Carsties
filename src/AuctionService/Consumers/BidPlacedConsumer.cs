using AuctionService;
using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class BidPlacedConsumer : IConsumer<BidPlaced>
{
    private readonly AuctionDbContext _context;

    public BidPlacedConsumer(AuctionDbContext context)
    {
        _context = context;
    }

    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        Console.WriteLine("========> Consuming BidPlaced Event in AuctionService");

        if (!Guid.TryParse(context.Message.AuctionID, out var auctionId))
        {
            Console.WriteLine($"====> Invalid AuctionID format: {context.Message.AuctionID}");
            return;
        }

        var auction = await _context.Auctions.FindAsync(auctionId);

        if (auction == null)
        {
            Console.WriteLine($"====> Auction not found: {auctionId}");
            return;
        }

        if (context.Message.Status.Contains("Accepted") && 
            context.Message.Amount > (auction.CurrentHighBid ?? 0))
        {
            auction.CurrentHighBid = context.Message.Amount;
            auction.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            Console.WriteLine($"====> Updated CurrentHighBid for Auction {auctionId} to {context.Message.Amount}");
        }
        else
        {
            Console.WriteLine($"====> Bid not accepted or amount too low. Status: {context.Message.Status}, Amount: {context.Message.Amount}, CurrentHighBid: {auction.CurrentHighBid}");
        }
    }
}

