using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionController : ControllerBase
{
    private readonly AuctionDbContext _context;
    private readonly IMapper _mapper;

    public AuctionController(AuctionDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionDTO>>> GetAllAuctions()
    {
        var auctions = await _context.Auctions
            .Include(x => x.Item)
            .OrderBy(x => x.Item.Make)
            .ToListAsync();

        return _mapper.Map<List<AuctionDTO>>(auctions);
    }

    [HttpGet("{ID}")]
    public async Task<ActionResult<AuctionDTO>> GetAuction(Guid ID)
    {
        var auction = await _context.Auctions
            .Include(x => x.Item)
            .Where(x => x.Id == ID)
            .FirstOrDefaultAsync();

        if (auction is null) return NotFound();

        return _mapper.Map<AuctionDTO>(auction);
    }

    [HttpPost]
    public async Task<ActionResult<AuctionDTO>> CreateAuction(CreateAuctionDTO auctionDto)
    {
        var auction = _mapper.Map<Auction>(auctionDto);
        auction.Seller = "Test";
        _context.Auctions.Add(auction);
        return
            (await _context.SaveChangesAsync()) > 0
                ? CreatedAtAction(nameof(GetAuction), new { auction.Id }, _mapper.Map<AuctionDTO>(auction))
                : BadRequest("Bad Request");
    }

    [HttpPut("{ID}")]
    public async Task<ActionResult> UpdateAuction(Guid ID, UpdateAuctionDTO updatedDto)
    {
        var auction = await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == ID);

        if (auction is null) NotFound();

        auction.Item.Make = updatedDto.Make ?? auction.Item.Make;
        auction.Item.Year = updatedDto.Year ?? auction.Item.Year;
        auction.Item.Mileage = updatedDto.Mileage ?? auction.Item.Mileage;
        auction.Item.Model = updatedDto.Model ?? auction.Item.Model;
        auction.Item.Color = updatedDto.Color ?? auction.Item.Color;

        return (await _context.SaveChangesAsync()) > 0
            ? Ok()
            : BadRequest("Bad Request");
    }
    [HttpDelete("{ID}")]
    public async Task<ActionResult> DeleteAuction(Guid ID)
    {
        var auction = _context.Auctions.Where(x => x.Id == ID).FirstOrDefault();

        if (auction is null) NotFound();

        _context.Auctions.Remove(auction);
        return (await _context.SaveChangesAsync() > 0)
            ? Ok()
            : BadRequest("Bad Request");
    }
}
