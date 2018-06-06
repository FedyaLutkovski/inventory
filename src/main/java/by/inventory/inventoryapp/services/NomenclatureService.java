package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.Nomenclature;
import by.inventory.inventoryapp.repositories.NomenclatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NomenclatureService extends BaseService<Nomenclature> {
    private NomenclatureRepository nomenclatureRepository;

    @Autowired
    public void setRepository(NomenclatureRepository nomenclatureRepository) {
        this.nomenclatureRepository = nomenclatureRepository;
    }

    public Iterable<Nomenclature> getAll() {
        return nomenclatureRepository.findByDeletedDataIdIsNullOrderByNomenclatureType();
    }

    public Iterable<Nomenclature> getAllByNomenclatureType(Long nomenclatureType) {
        return nomenclatureRepository.findByNomenclatureType_IdAndDeletedDataIdIsNullOrderByNomenclatureType(nomenclatureType);
    }

    public Nomenclature getById(long id) {
        return nomenclatureRepository.findOne(id);
    }

    public Nomenclature save(Nomenclature model) {
        return nomenclatureRepository.save(model);
    }

    public Nomenclature add(Nomenclature model) {
        Nomenclature check = nomenclatureRepository.findByNameAndDeletedDataIsNull(model.getName().trim());
        if (check != null) {
            return null;
        } else {
            return save(model);
        }
    }

    public Nomenclature update(long id, Nomenclature model) {
        Nomenclature check = nomenclatureRepository.findByNameAndDeletedDataIsNull(model.getName().trim());
        if (check != null && !check.getId().equals(model.getId())) {
            return null;
        } else {
            Nomenclature storedModel = getById(id);
            if (storedModel != null) {
                storedModel.setName(model.getName());
                storedModel.setDescription(model.getDescription());
                storedModel.setImage(model.getImage());
                storedModel.setNomenclatureType(model.getNomenclatureType());
                save(storedModel);
                return getById(id);
            }
            return model;
        }

    }
}
