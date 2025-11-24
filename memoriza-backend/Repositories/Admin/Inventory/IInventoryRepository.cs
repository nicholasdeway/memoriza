using memoriza_backend.Models.Admin;

namespace memoriza_backend.Repositories.Admin.Inventory
{
    public interface IInventoryRepository
    {
        // Itens de estoque
        Task<IReadOnlyList<InventoryItem>> GetAllItemsAsync();
        Task<InventoryItem?> GetItemByIdAsync(Guid id);
        Task<InventoryItem> CreateItemAsync(InventoryItem item);
        Task UpdateItemAsync(InventoryItem item);

        // Movimentações (entrada/saída)
        Task AddMovementAsync(InventoryMovement movement);
        Task<IReadOnlyList<InventoryMovement>> GetMovementsByItemIdAsync(Guid itemId);
    }
}