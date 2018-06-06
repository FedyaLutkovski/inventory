package by.inventory.inventoryapp.dao;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import java.util.List;

@Entity
public class MoveOperation extends Operations {
    @ManyToOne
    @JoinColumn(name = "new_placeOfStorage_id", nullable = true)
    private PlaceOfStorage newPlaceOfStorage;
    @ManyToMany
    protected List<NomenclatureCard> nomenclatureCards;
    @ManyToOne
    @JoinColumn(name = "placeOfStorage_id", nullable = true)
    private PlaceOfStorage placeOfStorage;

    public PlaceOfStorage getPlaceOfStorage() {
        return placeOfStorage;
    }

    public void setPlaceOfStorage(PlaceOfStorage placeOfStorage) {
        this.placeOfStorage = placeOfStorage;
    }

    public PlaceOfStorage getNewPlaceOfStorage() {
        return newPlaceOfStorage;
    }

    public void setNewPlaceOfStorage(PlaceOfStorage newPlaceOfStorage) {
        this.newPlaceOfStorage = newPlaceOfStorage;
    }

    public List<NomenclatureCard> getNomenclatureCards() {
        return nomenclatureCards;
    }

    public void setNomenclatureCards(List<NomenclatureCard> nomenclatureCards) {
        this.nomenclatureCards = nomenclatureCards;
    }
}
