package by.inventory.inventoryapp.dao;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import java.util.List;

@Entity
public class WriteOffOperation extends Operations {
    @ManyToMany
    private List<NomenclatureCard> nomenclatureCards;
    @ManyToOne
    @JoinColumn(name = "placeOfStorage_id", nullable = true)
    private PlaceOfStorage placeOfStorage;

    public PlaceOfStorage getPlaceOfStorage() {
        return placeOfStorage;
    }

    public void setPlaceOfStorage(PlaceOfStorage placeOfStorage) {
        this.placeOfStorage = placeOfStorage;
    }

    public List<NomenclatureCard> getNomenclatureCards() {
        return nomenclatureCards;
    }

    public void setNomenclatureCards(List<NomenclatureCard> nomenclatureCards) {
        this.nomenclatureCards = nomenclatureCards;
    }
}
