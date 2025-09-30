using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService;
using SearchService.RequestHelper;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Item>>> SearchItems([FromQuery] SearchParams searchParams)
    {
        var query = DB.PagedSearch<Item, Item>().Sort(x => x.Ascending(x => x.Make));

        if (!string.IsNullOrEmpty(searchParams.SearchTerm))
            query.Match(Search.Full, searchParams.SearchTerm).SortByTextScore();

        query = searchParams.OrderBy switch
        {
            "make" => query.Sort(x => x.Ascending(x => x.Make)),
            "new" => query.Sort(x => x.Descending(x => x.CreatedAt)),
            _ => query.Sort(x => x.Descending(x => x.AuctionEnd))
        };

        query = searchParams.FilterBy switch
        {
            "finished" => query.Match(x => x.AuctionEnd < DateTime.UtcNow),
            "endingSoon" => query.Match(x =>
                x.AuctionEnd > DateTime.UtcNow &&
                x.AuctionEnd < DateTime.UtcNow.AddHours(6)
                ),
            _ => query.Match(x => x.AuctionEnd > DateTime.UtcNow)
        };

        if (!string.IsNullOrEmpty(searchParams.Seller))
            query = query.Match(x => x.Seller == searchParams.Seller);

        if (!string.IsNullOrEmpty(searchParams.Winner))
            query = query.Match(x => x.Winner == searchParams.Winner);

        query.PageNumber(searchParams.PageNumber);
        query.PageSize(searchParams.PageSize);
        var result = await query.ExecuteAsync();

        return Ok(new
        {
            result,
            totalCount = result.TotalCount,
            pageNumber = result.PageCount
        });
    }
}