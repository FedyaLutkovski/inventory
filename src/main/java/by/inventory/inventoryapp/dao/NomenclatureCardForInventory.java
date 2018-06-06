package by.inventory.inventoryapp.dao;

import javax.persistence.*;
import java.util.Date;

@Entity
public class NomenclatureCardForInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String inventoryNumber;
    private String serialNumber;
    private String barcode;
    private String guarantee;
    private long count;
    private Date receiptDate;
    @ManyToOne
    @JoinColumn(name = "collection_for_inventory_id", nullable = true)
    private CollectionForInventory collectionForInventory;
    @ManyToOne
    @JoinColumn(name = "nomenclature_id", nullable = false)
    private Nomenclature nomenclature;
    @ManyToOne
    @JoinColumn(name = "deleted_data_id", nullable = true)
    private DeletedData deletedData;
    @Transient
    private long collectionId;
    private String placeOfStorage;
    private String worker;

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

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public Date getReceiptDate() {
        return receiptDate;
    }

    public void setReceiptDate(Date receiptDate) {
        this.receiptDate = receiptDate;
    }


    public Nomenclature getNomenclature() {
        return nomenclature;
    }

    public void setNomenclature(Nomenclature nomenclature) {
        this.nomenclature = nomenclature;
    }

    public DeletedData getDeletedData() {
        return deletedData;
    }

    public void setDeletedData(DeletedData deletedData) {
        this.deletedData = deletedData;
    }

    public long getCollectionId() {
        return collectionId;
    }

    public void setCollectionId(long collectionId) {
        this.collectionId = collectionId;
    }

    public String getPlaceOfStorage() {
        return placeOfStorage;
    }

    public void setPlaceOfStorage(String placeOfStorage) {
        this.placeOfStorage = placeOfStorage;
    }

    public String getWorker() {
        return worker;
    }

    public void setWorker(String worker) {
        this.worker = worker;
    }

    public CollectionForInventory getCollectionForInventory() {
        return collectionForInventory;
    }

    public void setCollectionForInventory(CollectionForInventory collectionForInventory) {
        this.collectionForInventory = collectionForInventory;
    }
}
