package by.inventory.inventoryapp.dao;

import javax.persistence.*;
import java.util.List;

@Entity
public class PlaceOfStorage implements DeletedModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private Long parent;
    @ManyToOne
    @JoinColumn(name = "type_of_storage_place_id", nullable = false)
    private TypeOfStoragePlace typeOfStoragePlace;
    @ManyToOne
    @JoinColumn(name = "workers_id", nullable = true)
    private Workers workers;
    @ManyToOne
    @JoinColumn(name = "deleted_data_id", nullable = true)
    private DeletedData deletedData;
    @OneToMany
    private List<NomenclatureCard> nomenclatureCards;
    @Transient
    private List<PlaceOfStorage> nodes;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getParent() {
        return parent;
    }

    public void setParent(Long parent) {
        this.parent = parent;
    }

    public TypeOfStoragePlace getTypeOfStoragePlace() {
        return typeOfStoragePlace;
    }

    public void setTypeOfStoragePlace(TypeOfStoragePlace typeOfStoragePlace) {
        this.typeOfStoragePlace = typeOfStoragePlace;
    }

    public Workers getWorkers() {
        return workers;
    }

    public void setWorkers(Workers workers) {
        this.workers = workers;
    }

    public DeletedData getDeletedData() {
        return deletedData;
    }

    public void setDeletedData(DeletedData deletedData) {
        this.deletedData = deletedData;
    }

    public List<PlaceOfStorage> getNodes() {
        return nodes;
    }

    public void setNodes(List<PlaceOfStorage> nodes) {
        this.nodes = nodes;
    }

    public List<NomenclatureCard> getNomenclatureCards() {
        return nomenclatureCards;
    }

    public void setNomenclatureCards(NomenclatureCard nomenclatureCard) {
        this.nomenclatureCards.add(nomenclatureCard);
    }

    public void setListNomenclatureCards(List<NomenclatureCard> nomenclatureCard) {
        this.nomenclatureCards = nomenclatureCard;
    }

    public void deleteNomenclatureCard(NomenclatureCard nomenclatureCard) {
        this.nomenclatureCards.remove(nomenclatureCard);
    }
}
