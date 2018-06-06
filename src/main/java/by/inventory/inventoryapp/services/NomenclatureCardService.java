package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.Collection;
import by.inventory.inventoryapp.dao.NomenclatureCard;
import by.inventory.inventoryapp.dao.UnicBarcodeInventorySerial;
import by.inventory.inventoryapp.dao.WriteOffOperation;
import by.inventory.inventoryapp.repositories.CollectionRepository;
import by.inventory.inventoryapp.repositories.NomenclatureCardRepository;
import by.inventory.inventoryapp.repositories.WriteOffOperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class NomenclatureCardService extends BaseService<NomenclatureCard> {
    private NomenclatureCardRepository nomenclatureCardRepository;
    private PlaceOfStorageService placeOfStorageService;
    private WriteOffOperationRepository writeOffOperationRepository;
    private CollectionRepository collectionRepository;
    private UserService userService;

    @Autowired
    public void setService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setRepository(NomenclatureCardRepository nomenclatureCardRepository) {
        this.nomenclatureCardRepository = nomenclatureCardRepository;
    }

    @Autowired
    public void setRepository(PlaceOfStorageService placeOfStorageService) {
        this.placeOfStorageService = placeOfStorageService;
    }

    @Autowired
    public void setRepository(WriteOffOperationRepository writeOffOperationRepository) {
        this.writeOffOperationRepository = writeOffOperationRepository;
    }

    @Autowired
    public void setRepository(CollectionRepository collectionRepository) {
        this.collectionRepository = collectionRepository;
    }

    public Iterable<NomenclatureCard> getAll() {
        return nomenclatureCardRepository.findByDeletedDataIdIsNullOrderById();
    }

    public Iterable<NomenclatureCard> getAllByCollection(long collectionId) {
        return nomenclatureCardRepository.findByDeletedDataIdIsNullAndCollection_IdOrderById(collectionId);
    }

    public UnicBarcodeInventorySerial unicBarcodeInventorySerial(NomenclatureCard nomenclatureCard) {
        UnicBarcodeInventorySerial unicBarcodeInventorySerial = new UnicBarcodeInventorySerial();
        NomenclatureCard findNc;
        Collection findC;
        if (nomenclatureCard.getBarcode() != null && !nomenclatureCard.getBarcode().equals("")) {
            findNc = getByBarcode(nomenclatureCard.getBarcode());
            findC = collectionRepository.findByBarcodeAndDeletedDataIdIsNull(nomenclatureCard.getBarcode());
            if ((findNc != null && !findNc.getId().equals(nomenclatureCard.getId())) || findC != null) {
                unicBarcodeInventorySerial.setBarcode(true);
            }
        }
        if (nomenclatureCard.getInventoryNumber() != null && !nomenclatureCard.getInventoryNumber().equals("")) {
            findNc = getByInventoryNumber(nomenclatureCard.getInventoryNumber());
            findC = collectionRepository.findByInventoryNumberAndDeletedDataIdIsNull(nomenclatureCard.getInventoryNumber());
            if ((findNc != null && !findNc.getId().equals(nomenclatureCard.getId())) || findC != null) {
                unicBarcodeInventorySerial.setInventory(true);
            }
        }
        if (nomenclatureCard.getSerialNumber() != null && !nomenclatureCard.getSerialNumber().equals("")) {
            findNc = getBySerialNumber(nomenclatureCard.getSerialNumber());
            findC = collectionRepository.findBySerialNumberAndDeletedDataIdIsNull(nomenclatureCard.getSerialNumber());
            if ((findNc != null && !findNc.getId().equals(nomenclatureCard.getId())) || findC != null) {
                unicBarcodeInventorySerial.setSerial(true);
            }
        }
        return unicBarcodeInventorySerial;
    }

    public NomenclatureCard getByBarcode(String barcode) {
        return nomenclatureCardRepository.findByBarcodeAndDeletedDataIdIsNull(barcode);
    }

    public NomenclatureCard getByInventoryNumber(String inventoryNumber) {
        return nomenclatureCardRepository.findByInventoryNumberAndDeletedDataIdIsNull(inventoryNumber);
    }

    public NomenclatureCard getBySerialNumber(String serialNumber) {
        return nomenclatureCardRepository.findBySerialNumberAndDeletedDataIdIsNull(serialNumber);
    }

    public NomenclatureCard getById(long id) {
        return nomenclatureCardRepository.findOne(id);
    }

    public NomenclatureCard save(NomenclatureCard model) {
        return nomenclatureCardRepository.save(model);
    }

    public NomenclatureCard add(NomenclatureCard model) {
        return save(model);
    }

    public NomenclatureCard update(long id, NomenclatureCard model) {
        NomenclatureCard storedModel = getById(id);
        if (storedModel != null) {
            storedModel.setBarcode(model.getBarcode());
            storedModel.setCollection(model.getCollection());
            storedModel.setGuarantee(model.getGuarantee());
            storedModel.setInventoryNumber(model.getInventoryNumber());
            storedModel.setNomenclature(model.getNomenclature());
            storedModel.setReceiptDate(model.getReceiptDate());
            storedModel.setSerialNumber(model.getSerialNumber());
            storedModel.setServiceDate(model.getServiceDate());
            storedModel.setCount(model.getCount());
            save(storedModel);
            return getById(id);
        }
        return model;
    }

    public void writeOff(List<NomenclatureCard> writeOffNomenclatureCards, Long placeOfStorageId) {
        List<NomenclatureCard> finalList = new ArrayList<>();
        writeOffNomenclatureCards.forEach(nomenclatureCard -> {
            long id = nomenclatureCard.getId();
            if (nomenclatureCard.getCount() == getById(id).getCount()) {
                finalList.add(nomenclatureCard);
                delete(id);
            } else {
                NomenclatureCard existNomenclatureCard = getById(id);
                long newCount = getById(id).getCount() - nomenclatureCard.getCount();
                if (newCount > 0) {
                    existNomenclatureCard.setCount(newCount);
                    save(existNomenclatureCard);
                    nomenclatureCard.setId(null);
                    NomenclatureCard removableNomenclatureCard = add(nomenclatureCard);
                    finalList.add(removableNomenclatureCard);
                    delete(removableNomenclatureCard.getId());
                } else {
                    finalList.add(nomenclatureCard);
                    delete(id);
                }
            }
        });
        if (!finalList.isEmpty()) {
            WriteOffOperation writeOffOperation = new WriteOffOperation();
            writeOffOperation.setOperationDate(new Date());
            writeOffOperation.setNomenclatureCards(finalList);
            writeOffOperation.setAppUser(userService.getCurrentUser());
            writeOffOperation.setPlaceOfStorage(placeOfStorageService.getById(placeOfStorageId));
            if (writeOffOperationRepository.findFirstByOrderByIdDesc() != null) {
                writeOffOperation.setDocumentNumber(writeOffOperationRepository.findFirstByOrderByIdDesc().getDocumentNumber() + 1);
            } else {
                long n = 1;
                writeOffOperation.setDocumentNumber(n);
            }
            writeOffOperationRepository.save(writeOffOperation);
        }
    }
}
