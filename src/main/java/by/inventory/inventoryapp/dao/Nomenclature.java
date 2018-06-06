package by.inventory.inventoryapp.dao;

import javax.persistence.*;
import java.util.Objects;

@Entity
public class Nomenclature implements DeletedModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String description;
    private String image;
    @ManyToOne
    @JoinColumn(name="nomenclature_type_id", nullable = false)
    private NomenclatureType nomenclatureType;
    @ManyToOne
    @JoinColumn(name="deleted_data_id", nullable = true)
    private DeletedData deletedData;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public NomenclatureType getNomenclatureType() {
        return nomenclatureType;
    }

    public void setNomenclatureType(NomenclatureType nomenclatureType) {
        this.nomenclatureType = nomenclatureType;
    }

    public DeletedData getDeletedData() {
        return deletedData;
    }

    public void setDeletedData(DeletedData deletedData) {
        this.deletedData = deletedData;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Nomenclature that = (Nomenclature) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, name, description, image, nomenclatureType, deletedData);
    }
}
