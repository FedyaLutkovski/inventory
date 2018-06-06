package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.NomenclatureCardForInventory;
import by.inventory.inventoryapp.repositories.NomenclatureCardForInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NomenclatureCardForInventoryService {
    private NomenclatureCardForInventoryRepository nomenclatureCardForInventoryRepository;

    @Autowired
    public void setRepository(NomenclatureCardForInventoryRepository nomenclatureCardForInventoryRepository) {
        this.nomenclatureCardForInventoryRepository = nomenclatureCardForInventoryRepository;
    }

    public Iterable<NomenclatureCardForInventory> getAll() {
        return nomenclatureCardForInventoryRepository.findByDeletedDataIdIsNullOrderById();
    }

    public NomenclatureCardForInventory getById(long id) {
        return nomenclatureCardForInventoryRepository.findOne(id);
    }

    public NomenclatureCardForInventory save(NomenclatureCardForInventory model) {
        return nomenclatureCardForInventoryRepository.save(model);
    }

    public NomenclatureCardForInventory add(NomenclatureCardForInventory model) {
        return save(model);
    }
}
