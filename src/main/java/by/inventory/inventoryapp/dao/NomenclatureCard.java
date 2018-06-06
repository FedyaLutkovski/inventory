package by.inventory.inventoryapp.dao;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;

@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Entity
public class NomenclatureCard implements DeletedModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String inventoryNumber;
    private String serialNumber;
    private String barcode;
    private String guarantee;
    private long count;
    private Date receiptDate;
    private Date serviceDate;
    @ManyToOne
    @JoinColumn(name = "collection_id", nullable = true)
    private Collection collection;
    @ManyToOne
    @JoinColumn(name = "nomenclature_id", nullable = false)
    private Nomenclature nomenclature;
    @ManyToOne
    @JoinColumn(name = "deleted_data_id", nullable = true)
    private DeletedData deletedData;
    @Transient
    private long collectionId;

    public long getCollectionId() {
        return collectionId;
    }

    public void setCollectionId(long collectionId) {
        this.collectionId = collectionId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInventoryNumber() {
        return inventoryNumber;
    }

    public void setInventoryNumber(String inventoryNumber) {
        this.inventoryNumber = inventoryNumber;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getGuarantee() {
        return guarantee;
    }

    public void setGuarantee(String guarantee) {
        this.guarantee = guarantee;
    }

    public Date getReceiptDate() {
        return receiptDate;
    }

    public void setReceiptDate(Date receiptDate) {
        this.receiptDate = receiptDate;
    }

    public Collection getCollection() {
        return collection;
    }

    public void setCollection(Collection collection) {
        this.collection = collection;
    }

    public Nomenclature getNomenclature() {
        return nomenclature;
    }

    public void setNomenclature(Nomenclature nomenclature) {
        this.nomenclature = nomenclature;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public DeletedData getDeletedData() {
        return deletedData;
    }

    public void setDeletedData(DeletedData deletedData) {
        this.deletedData = deletedData;
    }

    public Date getServiceDate() {
        return serviceDate;
    }

    public void setServiceDate(Date serviceDate) {
        this.serviceDate = serviceDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NomenclatureCard that = (NomenclatureCard) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, inventoryNumber, serialNumber, barcode, guarantee, count, receiptDate, collection, nomenclature, deletedData, collectionId);
    }
}
