package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.Collection;
import by.inventory.inventoryapp.dao.NomenclatureCard;
import by.inventory.inventoryapp.dao.UnicBarcodeInventorySerial;
import by.inventory.inventoryapp.repositories.CollectionRepository;
import by.inventory.inventoryapp.repositories.NomenclatureCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CollectionService extends BaseService<Collection> {
    private CollectionRepository collectionRepository;
    private NomenclatureCardRepository nomenclatureCardRepository;

    @Autowired
    public void setRepository(CollectionRepository collectionRepository) {
        this.collectionRepository = collectionRepository;
    }

    @Autowired
    public void setRepository(NomenclatureCardRepository nomenclatureCardRepository) {
        this.nomenclatureCardRepository = nomenclatureCardRepository;
    }


    public UnicBarcodeInventorySerial unicBarcodeInventorySerial(Collection collection) {
        UnicBarcodeInventorySerial unicBarcodeInventorySerial = new UnicBarcodeInventorySerial();
        Collection findC;
        NomenclatureCard findNc;
        if (collection.getBarcode() != null && !collection.getBarcode().equals("")) {
            String barcode = collection.getBarcode();
            findNc = nomenclatureCardRepository.findByBarcodeAndDeletedDataIdIsNull(barcode);
            findC = collectionRepository.findByBarcodeAndDeletedDataIdIsNull(barcode);
            if ((findC != null && !findC.getId().equals(collection.getId())) || findNc != null) {
                unicBarcodeInventorySerial.setBarcode(true);
            }
        }
        if (collection.getInventoryNumber() != null && !collection.getInventoryNumber().equals("")) {
            String inventoryNumber = collection.getInventoryNumber();
            findNc = nomenclatureCardRepository.findByInventoryNumberAndDeletedDataIdIsNull(inventoryNumber);
            findC = collectionRepository.findByInventoryNumberAndDeletedDataIdIsNull(inventoryNumber);
            if ((findC != null && !findC.getId().equals(collection.getId())) || findNc != null) {
                unicBarcodeInventorySerial.setInventory(true);
            }
        }
        if (collection.getSerialNumber() != null && !collection.getSerialNumber().equals("")) {
            String serialNumber = collection.getSerialNumber();
            findNc = nomenclatureCardRepository.findBySerialNumberAndDeletedDataIdIsNull(serialNumber);
            findC = collectionRepository.findBySerialNumberAndDeletedDataIdIsNull(serialNumber);
            if ((findC != null && !findC.getId().equals(collection.getId())) || findNc != null) {
                unicBarcodeInventorySerial.setSerial(true);
            }
        }
        return unicBarcodeInventorySerial;
    }


    public Iterable<Collection> getAll() {
        return collectionRepository.findByDeletedDataIdIsNullOrderById();
    }

    public Collection getById(long id) {
        return collectionRepository.findOne(id);
    }

    public Collection save(Collection model) {
        return collectionRepository.save(model);
    }

    public Collection add(Collection model) {
        return save(model);
    }

    public Collection update(long id, Collection model) {
        Collection storedModel = getById(id);
        if (storedModel != null) {
            storedModel.setName(model.getName());
            storedModel.setBarcode(model.getBarcode());
            storedModel.setGuarantee(model.getGuarantee());
            storedModel.setInventoryNumber(model.getInventoryNumber());
            storedModel.setBuildDate(model.getBuildDate());
            storedModel.setSerialNumber(model.getSerialNumber());
            storedModel.setServicedDate(model.getServicedDate());
            save(storedModel);
            return getById(id);
        }
        return model;
    }

}
