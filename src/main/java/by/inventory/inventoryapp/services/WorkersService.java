package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.Workers;
import by.inventory.inventoryapp.repositories.WorkersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WorkersService extends BaseService<Workers> {
    private WorkersRepository workersRepository;

    @Autowired
    public void setRepository(WorkersRepository workersRepository) {
        this.workersRepository = workersRepository;
    }

    public Iterable<Workers> getAll() {
        return workersRepository.findByDeletedDataIdIsNullOrderById();
    }

    @Override
    public Workers getById(long id) {
        return workersRepository.findOne(id);
    }

    public Workers save(Workers model) {
        return workersRepository.save(model);
    }

    public Workers add(Workers model) {
        return save(model);
    }

    public Workers update(long id, Workers model) {
        Workers storedModel = getById(id);
        if (storedModel != null) {
            storedModel.setName(model.getName());
            storedModel.setPatronymic(model.getPatronymic());
            storedModel.setSurname(model.getSurname());
            storedModel.setPhone(model.getPhone());
            storedModel.setSubUnit(model.getSubUnit());
            storedModel.setDescription(model.getDescription());
            save(storedModel);
            return getById(id);
        }
        return model;
    }
}
