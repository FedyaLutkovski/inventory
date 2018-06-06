package by.inventory.inventoryapp.dao;

import java.util.List;
import java.util.Map;

public class ParseFile {
    private int id;
    private long parent;
    private String name;
    private String workerName;
    private String workerSurname;
    private String workerPatronymic;
    private String workerDescription;
    private List<Map<String, String>> device;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public long getParent() {
        return parent;
    }

    public void setParent(long parent) {
        this.parent = parent;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Map<String, String>> getDevice() {
        return device;
    }

    public void setDevice(List<Map<String, String>> device) {
        this.device = device;
    }

    public String getWorkerName() {
        return workerName;
    }

    public void setWorkerName(String workerName) {
        this.workerName = workerName;
    }

    public String getWorkerSurname() {
        return workerSurname;
    }

    public void setWorkerSurname(String workerSurname) {
        this.workerSurname = workerSurname;
    }

    public String getWorkerPatronymic() {
        return workerPatronymic;
    }

    public void setWorkerPatronymic(String workerPatronymic) {
        this.workerPatronymic = workerPatronymic;
    }

    public String getWorkerDescription() {
        return workerDescription;
    }

    public void setWorkerDescription(String workerDescription) {
        this.workerDescription = workerDescription;
    }
}
