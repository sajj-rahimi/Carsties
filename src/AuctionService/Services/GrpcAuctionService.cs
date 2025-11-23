namespace AuctionService.Services;

public class GrpcAuctionService : GrpcAuction.GrpcAuctionBase
{
    private readonly AuctionDbContext _context;

    public GrpcAuctionService(AuctionDbContext context)
    {
        _context = context;
    }
    override public async Task<GetAuctionResponse> GetAuction(GetAuctionRequest request, Grpc.Core.ServerCallContext context)
    {
        var auction = await _context.Auctions.FindAsync(request.ID) ??
            throw new Grpc.Core.RpcException(new Grpc.Core.Status(Grpc.Core.StatusCode.NotFound, $"Auction with ID {request.ID} not found."));

        return new GetAuctionResponse
        {
            Auction = new GetAuctionModel
            {
                Id = auction.Id.ToString(),
                AuctionEnd = auction.AuctionEnd.ToString(),
                ReservePrice = auction.ReservePrice,
                Seller = auction.Seller,
            }
        };
    }
}