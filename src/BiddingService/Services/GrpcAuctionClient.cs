using AuctionService;
using BiddingService.Models;
using Grpc.Net.Client;

namespace BiddingService;

public class GrpcAuctionClient
{
    private readonly ILogger _logger;
    private readonly IConfiguration _configuration;

    public GrpcAuctionClient(ILogger<GrpcAuctionClient> logger, IConfiguration configuration)
    {
        _logger = logger;
        this._configuration = configuration;
    }
    public Auction GetAuction(string ID)
    {
        _logger.LogInformation("Calling GRPC service");
        var channel = GrpcChannel.ForAddress(_configuration["GrpcAuction"]);
        var client = new GrpcAuction.GrpcAuctionClient(channel);
        var request = new GetAuctionRequest { ID = ID };

        try
        {
            var reply = client.GetAuction(request);
            var auction = new Auction
            {
                ID = reply.Auction.Id,
                AutionEnd = DateTime.Parse(reply.Auction.AuctionEnd),
                Seller = reply.Auction.Seller,
                ReservePrice = reply.Auction.ReservePrice
            };

            return auction;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error Calling GRPC service");
            throw;
        }
    }
}