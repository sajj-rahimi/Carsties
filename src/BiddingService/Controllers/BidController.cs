using AutoMapper;
using BiddingService.DTOs;
using BiddingService.Enums;
using BiddingService.Models;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BidController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;

    public BidController(IMapper mapper, IPublishEndpoint publishEndpoint)
    {
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BidDTO>> PlaceBid(string auctionID, int amount)
    {
        var auction = await DB.Find<Auction>().OneAsync(auctionID);

        if (auction is null)
        {
            // TODO: check if auction service has that auction
            return NotFound("Auction not found");
        }

        if (auction.Seller == User.Identity.Name)
            return BadRequest("Seller cannot place bid on own auction");

        var bid = new Bid
        {
            AuctionID = auctionID,
            Bidder = User.Identity.Name!,
            Amount = amount,
        };

        if (auction.AutionEnd < DateTime.UtcNow)
            bid.Status = BidStatus.Finished;
        else
        {
            var highestBid = await DB.Find<Bid>()
                .Match(b => b.AuctionID == auctionID)
                .Sort(b => b.Descending(x => x.Amount))
                .ExecuteFirstAsync();

            if (highestBid is not null && bid.Amount >= highestBid.Amount || highestBid is null)
                bid.Status = amount > auction.ReservePrice ? BidStatus.Accepted : BidStatus.AcceptedBelowReserve;

            if (highestBid is not null && bid.Amount < highestBid.Amount)
                highestBid.Status = BidStatus.TooLow;
        }

        await DB.SaveAsync(bid);
        await _publishEndpoint.Publish(_mapper.Map<BidPlaced>(bid));

        return Ok(_mapper.Map<BidDTO>(bid));
    }
    public async Task<ActionResult<List<BidDTO>>> GetBidForAuction(string auctionID)
    {
        var bids = await DB.Find<Bid>()
            .Match(b => b.AuctionID == auctionID)
            .Sort(b => b.Descending(x => x.BidTime))
            .ExecuteAsync();

        return Ok(bids.Select(_mapper.Map<BidDTO>).ToList());
    }
}