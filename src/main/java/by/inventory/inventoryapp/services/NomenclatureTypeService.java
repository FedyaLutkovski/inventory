package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.NomenclatureType;
import by.inventory.inventoryapp.repositories.NomenclatureTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NomenclatureTypeService extends BaseService<NomenclatureType> {
    private NomenclatureTypeRepository nomenclatureTypeRepository;

    @Autowired
    public void setRepository(NomenclatureTypeRepository nomenclatureTypeRepository) {
        this.nomenclatureTypeRepository = nomenclatureTypeRepository;
    }

    public Iterable<NomenclatureType> getAll() {
        return nomenclatureTypeRepository.findByDeletedDataIdIsNullOrderByName();
    }

    public NomenclatureType getById(long id) {
        return nomenclatureTypeRepository.findOne(id);
    }

    public NomenclatureType save(NomenclatureType model) {
        return nomenclatureTypeRepository.save(model);
    }

    public NomenclatureType add(NomenclatureType model) {
        NomenclatureType check = nomenclatureTypeRepository.findByNameAndDeletedDataIsNull(model.getName().trim());
        if (check != null) {
            return null;
        } else {
            return save(model);
        }
    }

    public NomenclatureType update(long id, NomenclatureType model) {
        NomenclatureType check = nomenclatureTypeRepository.findByNameAndDeletedDataIsNull(model.getName().trim());
        if (check != null && !check.getId().equals(model.getId())) {
            return null;
        } else {
            NomenclatureType storedModel = getById(id);
            if (storedModel != null) {
                storedModel.setName(model.getName());
                save(storedModel);
                return getById(id);
            }
            return model;
        }
    }
}
