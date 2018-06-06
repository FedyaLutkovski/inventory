package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.InventoryApplication;
import by.inventory.inventoryapp.dao.Collection;
import by.inventory.inventoryapp.dao.*;
import by.inventory.inventoryapp.repositories.CollectionRepository;
import by.inventory.inventoryapp.repositories.InventoryOperationRepository;
import by.inventory.inventoryapp.repositories.NomenclatureCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class InventoryOperationService extends BaseService<InventoryOperation> {
    private boolean flag;
    private InventoryOperationRepository inventoryOperationRepository;
    private CollectionRepository collectionRepository;
    private NomenclatureCardRepository nomenclatureCardRepository;
    private NomenclatureCardForInventoryService nomenclatureCardForInventoryService;
    private PlaceOfStorageService placeOfStorageService;
    private CollectionForInventoryService collectionForInventoryService;
    private UserService userService;

    @Autowired
    public void setService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setRepository(InventoryOperationRepository inventoryOperationRepository) {
        this.inventoryOperationRepository = inventoryOperationRepository;
    }

    @Autowired
    public void setRepository(CollectionRepository collectionRepository) {
        this.collectionRepository = collectionRepository;
    }

    @Autowired
    public void setRepository(NomenclatureCardRepository nomenclatureCardRepository) {
        this.nomenclatureCardRepository = nomenclatureCardRepository;
    }

    @Autowired
    public void setService(NomenclatureCardForInventoryService nomenclatureCardForInventoryService) {
        this.nomenclatureCardForInventoryService = nomenclatureCardForInventoryService;
    }

    @Autowired
    public void setService(PlaceOfStorageService placeOfStorageService) {
        this.placeOfStorageService = placeOfStorageService;
    }

    @Autowired
    public void setService(CollectionForInventoryService collectionForInventoryService) {
        this.collectionForInventoryService = collectionForInventoryService;
    }


    public Iterable<InventoryOperation> getAll() {
        if (userService.getCurrentUser().getRoles().indexOf("ADMIN") > -1) {
            return inventoryOperationRepository.findByDeletedDataIdIsNullOrderById();
        } else {
            return inventoryOperationRepository.findByAppUser_IdAndDeletedDataIsNullOrderById(userService.getCurrentUser().getId());
        }
    }

    @Override
    public InventoryOperation getById(long id) {
        return inventoryOperationRepository.findOne(id);
    }

    public InventoryOperation save(InventoryOperation model) {
        return inventoryOperationRepository.save(model);
    }

    public InventoryOperation add(InventoryOperation model) {
        return save(model);
    }

    public InventoryOperation update(long id, InventoryOperation model) {
        InventoryOperation storedModel = getById(id);
        if (storedModel != null) {
            storedModel.setOperationDate(model.getOperationDate());
            storedModel.setNomenclatureCardForInventory(model.getNomenclatureCardForInventory());
        }
        return model;
    }

    public void saveUploadedFiles(MultipartFile file, long id) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), "WINDOWS-1251"));
        Path path = Paths.get(InventoryApplication.DOWNLOAD_DIR + "/" + userService.getCurrentUser().getId() + "/inventory/" + file.getOriginalFilename());
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(String.valueOf(path)), "UTF-8"));
        int c;
        while ((c = br.read()) != -1) {
            bw.write((char) c);
        }
        br.close();
        bw.close();
        parseInventoryFile(id);
    }

    private String fullPlaceOfStorage(PlaceOfStorage placeOfStorage) {
        String fullName = placeOfStorage.getName();
        if (placeOfStorage.getParent() != 0) {
            fullName = fullPlaceOfStorage(placeOfStorageService.getById(placeOfStorage.getParent())) + " - " + fullName;
        }
        return fullName;
    }

    private NomenclatureCardForInventory ncToInventory(NomenclatureCard nomenclatureCard,
                                                       PlaceOfStorage placeOfStorage,
                                                       CollectionForInventory collectionForInventory) {
        NomenclatureCardForInventory nomenclatureCardForInventory = new NomenclatureCardForInventory();
        nomenclatureCardForInventory.setNomenclature(nomenclatureCard.getNomenclature());
        nomenclatureCardForInventory.setInventoryNumber(nomenclatureCard.getInventoryNumber());
        nomenclatureCardForInventory.setSerialNumber(nomenclatureCard.getSerialNumber());
        nomenclatureCardForInventory.setBarcode(nomenclatureCard.getBarcode());
        nomenclatureCardForInventory.setGuarantee(nomenclatureCard.getGuarantee());
        nomenclatureCardForInventory.setReceiptDate(nomenclatureCard.getReceiptDate());
        if (collectionForInventory != null) {
            nomenclatureCardForInventory.setCollectionForInventory(collectionForInventoryService.add(collectionForInventory));
        }
        nomenclatureCardForInventory.setCount(nomenclatureCard.getCount());
        if (placeOfStorage.getWorkers() != null) {
            String worker = placeOfStorage.getWorkers().getSurname() + " " + placeOfStorage.getWorkers().getName() + " " + placeOfStorage.getWorkers().getPatronymic();
            nomenclatureCardForInventory.setWorker(worker);
        }
        nomenclatureCardForInventory.setPlaceOfStorage(fullPlaceOfStorage(placeOfStorage));
        return nomenclatureCardForInventory;
    }

    private void parseInventoryFile(long id) {
        List<NomenclatureCardForInventory> listForInventoryOperation = new ArrayList<>();
        List<String> listOfFiles = Arrays.asList(Objects.requireNonNull(new File(InventoryApplication.DOWNLOAD_DIR + "/" + userService.getCurrentUser().getId() + "/inventory/").list()));
        List<Collection> collections = collectionRepository.findByDeletedDataIdIsNullOrderById();
        List<NomenclatureCard> nomenclatureCards = nomenclatureCardRepository.findByDeletedDataIdIsNullOrderById();
        listOfFiles.forEach(item -> {
            try {
                Files.readAllLines(Paths.get(InventoryApplication.DOWNLOAD_DIR + "/" + userService.getCurrentUser().getId() + "/inventory/" + item), StandardCharsets.UTF_8).stream().forEach(lines -> {
                    String barcode = lines.substring(lines.indexOf("[") + 1, lines.indexOf("]"));
                    flag = false;
                    collections.forEach(collection -> {
                        if (!flag && collection.getBarcode() != null && collection.getBarcode().equals(barcode)) {
                            CollectionForInventory collectionForInventory = new CollectionForInventory();
                            collectionForInventory.setName(collection.getName());
                            collectionForInventory.setInventoryNumber(collection.getInventoryNumber());
                            collectionForInventory.setSerialNumber(collection.getSerialNumber());
                            collectionForInventory.setBarcode(collection.getBarcode());
                            collectionForInventory.setGuarantee(collection.getGuarantee());
                            collectionForInventory.setBuildDate(collection.getBuildDate());
                            CollectionForInventory resultCollection = collectionForInventoryService.add(collectionForInventory);
                            nomenclatureCardRepository.findByDeletedDataIdIsNullAndCollection_IdOrderById(collection.getId()).forEach(nomenclatureCard -> {
                                PlaceOfStorage placeOfStorage = placeOfStorageService.findByNomenclatureCardsId(nomenclatureCard.getId());
                                listForInventoryOperation.add(nomenclatureCardForInventoryService.add(ncToInventory(nomenclatureCard, placeOfStorage, resultCollection)));
                                flag = true;
                            });
                        }
                    });
                    if (!flag) {
                        nomenclatureCards.forEach(nomenclatureCard -> {
                            if (!flag && nomenclatureCard.getBarcode() != null && nomenclatureCard.getBarcode().equals(barcode)) {
                                PlaceOfStorage placeOfStorage = placeOfStorageService.findByNomenclatureCardsId(nomenclatureCard.getId());
                                listForInventoryOperation.add(nomenclatureCardForInventoryService.add(ncToInventory(nomenclatureCard, placeOfStorage, null)));
                                flag = true;
                            }
                        });
                    }
                });
                Files.delete(Paths.get(InventoryApplication.DOWNLOAD_DIR + "/" + userService.getCurrentUser().getId() + "/inventory/" + item));
                if (!listForInventoryOperation.isEmpty()) {
                    if (id == 0) {
                        InventoryOperation inventoryOperation = new InventoryOperation();
                        inventoryOperation.setOperationDate(new Date());
                        inventoryOperation.setAppUser(userService.getCurrentUser());
                        inventoryOperation.setNomenclatureCardForInventory(listForInventoryOperation);
                        if (inventoryOperationRepository.findFirstByOrderByIdDesc() != null) {
                            inventoryOperation.setDocumentNumber(inventoryOperationRepository.findFirstByOrderByIdDesc().getDocumentNumber() + 1);
                        } else {
                            long n = 1;
                            inventoryOperation.setDocumentNumber(n);
                        }
                        add(inventoryOperation);
                    } else {
                        InventoryOperation inventoryOperation = getById(id);
                        inventoryOperation.addNomenclatureCardForInventory(listForInventoryOperation);
                        save(inventoryOperation);
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }
}
