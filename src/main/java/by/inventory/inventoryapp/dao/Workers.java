package by.inventory.inventoryapp.dao;

import javax.persistence.*;

@Entity
public class Workers implements DeletedModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String surname;
    private String name;
    private String patronymic;
    private String phone;
    private String description;
    @ManyToOne
    @JoinColumn(name = "sub_unit_id", nullable = false)
    private SubUnit subUnit;
    @ManyToOne
    @JoinColumn(name = "deleted_data_id", nullable = true)
    private DeletedData deletedData;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPatronymic() {
        return patronymic;
    }

    public void setPatronymic(String patronymic) {
        this.patronymic = patronymic;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public SubUnit getSubUnit() {
        return subUnit;
    }

    public void setSubUnit(SubUnit subUnit) {
        this.subUnit = subUnit;
    }

    public DeletedData getDeletedData() {
        return deletedData;
    }

    public void setDeletedData(DeletedData deletedData) {
        this.deletedData = deletedData;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
