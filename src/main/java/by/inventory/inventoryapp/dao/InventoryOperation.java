package by.inventory.inventoryapp.dao;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import java.util.List;

@Entity
public class InventoryOperation extends Operations {
    @ManyToMany
    private List<NomenclatureCardForInventory> nomenclatureCardForInventory;

    public List<NomenclatureCardForInventory> getNomenclatureCardForInventory() {
        return nomenclatureCardForInventory;
    }

    public void setNomenclatureCardForInventory(List<NomenclatureCardForInventory> nomenclatureCardForInventory) {
        this.nomenclatureCardForInventory = nomenclatureCardForInventory;
    }

    public void addNomenclatureCardForInventory(List<NomenclatureCardForInventory> nomenclatureCardForInventory) {
        this.nomenclatureCardForInventory.addAll(nomenclatureCardForInventory);
    }


}
