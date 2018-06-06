package by.inventory.inventoryapp.dao;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Collection implements DeletedModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String inventoryNumber;
    private String serialNumber;
    private String barcode;
    private String guarantee;
    private Date buildDate;
    private Date servicedDate;
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

    public Date getBuildDate() {
        return buildDate;
    }

    public void setBuildDate(Date buildDate) {
        this.buildDate = buildDate;
    }

    public DeletedData getDeletedData() {
        return deletedData;
    }

    public void setDeletedData(DeletedData deletedData) {
        this.deletedData = deletedData;
    }

    public Date getServicedDate() {
        return servicedDate;
    }

    public void setServicedDate(Date servicedDate) {
        this.servicedDate = servicedDate;
    }
}
