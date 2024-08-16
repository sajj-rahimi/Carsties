using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Entities;

namespace SearchService.Data
{
    public class DBInitializer
    {
        public static async Task Init(WebApplication app)
        {
            await DB.InitAsync(
                "SearchDB",
                MongoClientSettings.FromConnectionString(
                    app.Configuration.GetConnectionString("MongoDBConnection")
                    )
                );

            await DB.Index<Item>()
                .Key(x => x.Make, KeyType.Text)
                .Key(x => x.Model, KeyType.Text)
                .Key(x => x.Color, KeyType.Text)
                .CreateAsync();

            if (await DB.CountAsync<Item>() == 0)
            {
                var serializationOptions = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                var itemsJson = await File.ReadAllTextAsync("Data/Items.json");
                var items = JsonSerializer.Deserialize<List<Item>>(
                    itemsJson,
                    serializationOptions
                );
                await DB.SaveAsync(items);
            }
        }
    }
}