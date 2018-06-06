package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.InventoryApplication;
import by.inventory.inventoryapp.dao.*;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.ini4j.Wini;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ParseIniFileService {
    private NomenclatureTypeService nomenclatureTypeService;
    private NomenclatureService nomenclatureService;
    private NomenclatureCardService nomenclatureCardService;
    private PlaceOfStorageService placeOfStorageService;
    private TypeOfStoragePlaceService typeOfStoragePlaceService;
    private UserService userService;
    private WorkersService workersService;
    private SubUnitService subUnitService;


    @Autowired
    public void setService(SubUnitService subUnitService) {
        this.subUnitService = subUnitService;
    }

    @Autowired
    public void setService(WorkersService workersService) {
        this.workersService = workersService;
    }

    @Autowired
    public void setService(NomenclatureTypeService nomenclatureTypeService) {
        this.nomenclatureTypeService = nomenclatureTypeService;
    }

    @Autowired
    public void setService(NomenclatureService nomenclatureService) {
        this.nomenclatureService = nomenclatureService;
    }

    @Autowired
    public void setService(NomenclatureCardService nomenclatureCardService) {
        this.nomenclatureCardService = nomenclatureCardService;
    }

    @Autowired
    public void setService(PlaceOfStorageService placeOfStorageService) {
        this.placeOfStorageService = placeOfStorageService;
    }

    @Autowired
    public void setService(TypeOfStoragePlaceService typeOfStoragePlaceService) {
        this.typeOfStoragePlaceService = typeOfStoragePlaceService;
    }

    @Autowired
    public void setService(UserService userService) {
        this.userService = userService;
    }

    private int idx = 0;
    private int i = 0;
    private boolean flag = false;
    private TypeOfStoragePlace typeOfStoragePlace;

    private List<Map<String, String>> finalObject(Map<String, String> map) {
        Map sorted = map.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (oldValue, newValue) -> oldValue, LinkedHashMap::new));
        List<Map<String, String>> result = new ArrayList<>();
        Map<String, Integer> repeatedValues = new HashMap<>();
        sorted.forEach((k, v) -> {
            if (repeatedValues.get(v) == null) {
                repeatedValues.put((String) v, 1);
            } else {
                Map<String, String> deletedValue = new HashMap<>();
                result.forEach(value -> {
                    if (value.get("name").equals(v)) {
                        deletedValue.putAll(value);
                    }
                });
                result.remove(deletedValue);
                Integer i = repeatedValues.get(v);
                repeatedValues.put((String) v, ++i);
            }
            Map<String, String> m = new HashMap<>();
            String s = (String) k;
            m.put("id", String.valueOf(++idx));
            m.put("type", s.substring(s.lastIndexOf("|") + 1, s.length()).replaceAll("[0-9]", ""));
            m.put("name", (String) v);
            m.put("count", String.valueOf(repeatedValues.get(v)));
            result.add(m);
        });
        return result;
    }

    public List<ParseFile> parser() {
        List<ParseFile> result = new ArrayList<>();
        List<String> listOfIniFiles = Arrays.asList(new File(InventoryApplication.DOWNLOAD_DIR + "/" + userService.getCurrentUser().getId() + "/import/").list());
        listOfIniFiles.forEach(item -> {
            if (item.substring(item.indexOf(".") + 1, item.length()).equals("xls")) {
                result.addAll(parseExcelFile(item));
            }
            ;
            if (item.substring(item.indexOf(".") + 1, item.length()).equals("ini")) {
                result.addAll(parseIniFile(item));
            }
        });
        return result;
    }

    private List<ParseFile> parseIniFile(String item) {
        List<ParseFile> parseFiles = new ArrayList<>();
        List<String> sections = new ArrayList<>();
        sections.add("Суммарная информация");
        sections.add("SPD");
        Map<String, String> options = new HashMap<>();
        options.put("Монитор", "Монитор");
        options.put("Видеоадаптер", "Видеоадаптер");
        options.put("Дисковый накопитель", "Дисковый накопитель");
        options.put("Системная плата", "Материнская плата");
        options.put("Тип ЦП", "Процессор");
        options.put("Клавиатура", "Клавиатура");
        options.put("Мышь", "Мышь");
        options.put("Имя модуля", "Оперативная память");
        try {
            Wini ini = new Wini(new File(InventoryApplication.DOWNLOAD_DIR + "/" + userService.getCurrentUser().getId() + "/import/" + item));
            ParseFile obj = new ParseFile();
            Map<String, String> map = new HashMap<>();
            sections.forEach(section -> {
                if (ini.get(section) != null) {
                    ini.get(section).forEach((k, v) -> {
                        String s = k.substring(k.lastIndexOf("|") + 1, k.length()).replaceAll("[0-9]", "");
                        if (options.get(s) != null) {
                            map.put(k.replaceAll(s, options.get(s)), v);
                        }
                    });
                }
            });
            if (map.size() > 0) {

                obj.setId(++idx);
                obj.setName(item.substring(0, item.lastIndexOf(".")));
                obj.setDevice(finalObject(map));
                obj.setParent(0);
                parseFiles.add(obj);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return parseFiles;
    }

    private List<ParseFile> parseExcelFile(String item) {
        List<ParseFile> parseFiles = new ArrayList<>();
        HSSFWorkbook wb = null;
        try {
            InputStream in = new FileInputStream(InventoryApplication.DOWNLOAD_DIR + "/" + userService.getCurrentUser().getId() + "/import/" + item);
            wb = new HSSFWorkbook(in);
        } catch (IOException e) {
            e.printStackTrace();
        }

        assert wb != null;
        Sheet sheet = wb.getSheetAt(0);
        Iterator<Row> it = sheet.iterator();
        Row row = it.next();
        while (it.hasNext()) {
            row = it.next();
            Iterator<Cell> cells = row.iterator();
            List<String> currentRow = row(cells);

            ParseFile obj = new ParseFile();
            obj.setId(++idx);
            obj.setName(currentRow.get(0));
            String[] parts = currentRow.get(1).split(" ");
            if (parts.length == 3) {
                obj.setWorkerSurname(parts[0]);
                obj.setWorkerName(parts[1]);
                obj.setWorkerPatronymic(parts[2]);
            } else {
                obj.setWorkerSurname(currentRow.get(1));
            }
            obj.setWorkerDescription(currentRow.get(2));
            Map<String, String> finalRow = new HashMap<>();
            List<String> cell3 = devices(currentRow.get(3));
            List<String> cell4 = devices(currentRow.get(4));
            List<String> cell13 = devices(currentRow.get(13));
            i = 0;
            cell3.forEach(cell -> {
                finalRow.put("Процессор" + i, cell + "(" + cell4.get(i) + " " + cell13.get(i) + ")");
                i++;
            });
            List<String> cell5 = devices(currentRow.get(5));
            List<String> cell6 = devices(currentRow.get(6));
            List<String> cell8 = devices(currentRow.get(8));
            i = 0;
            cell5.forEach(cell -> {
                finalRow.put("Оперативная память" + i, cell + "(" + cell6.get(i) + " " + cell8.get(i) + ")");
                i++;
            });
            i = 0;
            List<String> cell9 = devices(currentRow.get(9));
            cell9.forEach(cell -> {
                finalRow.put("Видеоадаптер" + i, cell);
                i++;
            });
            List<String> cell11 = devices(currentRow.get(11));
            List<String> cell10 = devices(currentRow.get(10));
            List<String> cell12 = devices(currentRow.get(12));
            i = 0;
            cell11.forEach(cell -> {
                finalRow.put(cell, cell10.get(i) + "(" + cell12.get(i) + ")");
                i++;
            });
            finalRow.put("Материнская плата" + i, currentRow.get(16) + " " + currentRow.get(15) + "(SN" + currentRow.get(17) + ")");
            i = 0;
// Вывод подключенных принетров.  Если необходимо
//            List<String> cell19 = devices(currentRow.get(19));
//            cell19.forEach(cell -> {
//                finalRow.put("Принтер" + i, cell);
//                i++;
//            });
            List<String> cell18 = devices(currentRow.get(18));
            i = 0;
            cell18.forEach(cell -> {
                finalRow.put("Монитор" + i, cell);
                i++;
            });
            List<String> cell20 = devices(currentRow.get(20));
            i = 0;
            cell20.forEach(cell -> {
                finalRow.put("Клавиатура" + i, cell);
                i++;
            });
            List<String> cell21 = devices(currentRow.get(21));
            i = 0;
            cell21.forEach(cell -> {
                finalRow.put("Мышь" + i, cell);
                i++;
            });
            obj.setDevice(finalObject(finalRow));
            obj.setParent(0);
            parseFiles.add(obj);
        }
        return parseFiles;
    }

    private List<String> devices(String devices) {
        String[] parts = devices.split(",");
        List<String> result = new ArrayList<>();
        Arrays.asList(parts).forEach(part -> {
            result.add(part.trim());
        });
        return result;
    }

    private List<String> row(Iterator<Cell> cells) {
        List<String> result = new ArrayList<>();
        while (cells.hasNext()) {
            Cell cell = cells.next();
            switch (cell.getCellType()) {
                case Cell.CELL_TYPE_STRING:
                    result.add(cell.getStringCellValue());
                    break;
                case Cell.CELL_TYPE_NUMERIC:
                    result.add(String.valueOf(cell.getNumericCellValue()));
                    break;

                case Cell.CELL_TYPE_FORMULA:
                    result.add(String.valueOf(cell.getNumericCellValue()));
                    break;
                default:
                    break;
            }
        }
        return result;
    }

    private TypeOfStoragePlace getTypeOfStoragePlace() {
        typeOfStoragePlaceService.getAll().forEach(value -> {
            if (value.getName().equals("Склад")) {
                typeOfStoragePlace = value;
            }
        });
        if (typeOfStoragePlace == null) {
            TypeOfStoragePlace newTypeOfStoragePlace = new TypeOfStoragePlace();
            newTypeOfStoragePlace.setName("Склад");
            typeOfStoragePlace = typeOfStoragePlaceService.add(newTypeOfStoragePlace);
        }
        return typeOfStoragePlace;
    }

    ;

    public void importFile(List<ParseFile> model) {
        model.forEach(placeOfStorageModel -> {
            PlaceOfStorage placeOfStorage = new PlaceOfStorage();
            placeOfStorage.setName(placeOfStorageModel.getName());
            placeOfStorage.setParent(placeOfStorageModel.getParent());
            placeOfStorage.setListNomenclatureCards(new ArrayList<>());
            placeOfStorage.setTypeOfStoragePlace(getTypeOfStoragePlace());
            placeOfStorageModel.getDevice().forEach(device -> {
                List<NomenclatureType> allNomenclatureType = (List<NomenclatureType>) nomenclatureTypeService.getAll();
                List<Nomenclature> allNomenclatures = (List<Nomenclature>) nomenclatureService.getAll();
                NomenclatureType nomenclatureType = new NomenclatureType();
                nomenclatureType.setName(device.get("type").trim());
                idx = 0;
                allNomenclatureType.forEach(existNomenclatureType -> {
                    if (existNomenclatureType.getName().equals(nomenclatureType.getName())) {
                        idx = 1;
                        nomenclatureType.setId(existNomenclatureType.getId());
                        nomenclatureType.setName(existNomenclatureType.getName());
                    }
                });
                Nomenclature nomenclature = new Nomenclature();
                if (idx != 1) {
                    nomenclature.setNomenclatureType(nomenclatureTypeService.add(nomenclatureType));
                } else {
                    nomenclature.setNomenclatureType(nomenclatureType);
                }
                String deviceName = device.get("name");
                if (deviceName.contains("(")) {
                    String nomenclatureName = deviceName.substring(0, deviceName.indexOf("("));
                    String nomenclatureDiscription = deviceName.substring(deviceName.indexOf("("), deviceName.length());
                    nomenclature.setName(nomenclatureName.trim());
                    nomenclature.setDescription(nomenclatureDiscription.trim());
                } else {
                    nomenclature.setName(deviceName.trim());
                }

                idx = 0;
                allNomenclatures.forEach(existNomenclature -> {
                    if (existNomenclature.getName().equals(nomenclature.getName())) {
                        idx = 1;
                        nomenclature.setId(existNomenclature.getId());
                        nomenclature.setName(existNomenclature.getName().trim());
                        nomenclature.setNomenclatureType(existNomenclature.getNomenclatureType());
                        nomenclature.setDescription(existNomenclature.getDescription());
                        nomenclature.setImage(existNomenclature.getImage());
                    }
                });
                NomenclatureCard nomenclatureCard = new NomenclatureCard();
                if (idx != 1) {
                    nomenclatureCard.setNomenclature(nomenclatureService.add(nomenclature));
                } else {
                    nomenclatureCard.setNomenclature(nomenclature);
                }
                nomenclatureCard.setCount(Long.parseLong(device.get("count")));
                nomenclatureCard.setReceiptDate(new Date());
                placeOfStorage.setNomenclatureCards(nomenclatureCardService.add(nomenclatureCard));

            });


            idx = 0;
            List<Workers> allWorkers = (List<Workers>) workersService.getAll();
            String workerSurname = placeOfStorageModel.getWorkerSurname();
            String workerName = placeOfStorageModel.getWorkerName();
            String workerPatronymic = placeOfStorageModel.getWorkerPatronymic();
            Workers workers = new Workers();
            allWorkers.forEach(existWorker -> {
                if (existWorker.getName() != null && existWorker.getSurname() != null &&
                        existWorker.getPatronymic() != null && existWorker.getDescription() != null &&
                        existWorker.getName().equals(workerName) &&
                        existWorker.getSurname().equals(workerSurname) &&
                        existWorker.getPatronymic().equals(workerPatronymic) &&
                        existWorker.getDescription().equals(placeOfStorageModel.getWorkerDescription())) {
                    idx = 1;
                    workers.setId(existWorker.getId());
                    workers.setName(existWorker.getName());
                    workers.setSurname(existWorker.getSurname());
                    workers.setPatronymic(existWorker.getPatronymic());
                    workers.setPhone(existWorker.getPhone());
                    workers.setSubUnit(existWorker.getSubUnit());
                    workers.setDescription(existWorker.getDescription());
                }
            });
            if (idx != 1) {
                workers.setName(workerName);
                workers.setSurname(workerSurname);
                workers.setPatronymic(workerPatronymic);
                workers.setDescription(placeOfStorageModel.getWorkerDescription());
                List<SubUnit> allSubUnits = (List<SubUnit>) subUnitService.getAll();
                SubUnit subUnit = new SubUnit();
                allSubUnits.forEach(existSubUnit -> {
                    if (existSubUnit.getName().equals("Общий список")) {
                        subUnit.setId(existSubUnit.getId());
                        subUnit.setName(existSubUnit.getName());
                        workers.setSubUnit(existSubUnit);
                    }
                });
                if (subUnit.getName() == null) {
                    subUnit.setName("Общий список");
                    workers.setSubUnit(subUnitService.add(subUnit));
                }
                if (workers.getSurname() != null && !workers.getSurname().equals("-".trim()))
                    placeOfStorage.setWorkers(workersService.add(workers));
                else placeOfStorage.setWorkers(null);
            } else {
                placeOfStorage.setWorkers(workers);
            }


            idx = 0;
            placeOfStorageService.getAll().forEach(existPlaceOfstorage -> {
                if (existPlaceOfstorage.getName().equals(placeOfStorage.getName()) &&
                        existPlaceOfstorage.getDeletedData() == null) {
                    idx = Math.toIntExact(existPlaceOfstorage.getId());
                }
            });
            if (idx == 0) {
                placeOfStorageService.add(placeOfStorage);
            } else {
                placeOfStorage.getNomenclatureCards().forEach(nomenclatureCard -> {
                    placeOfStorageService.addNomenclatureCard(idx, nomenclatureCard);
                });
            }
        });
    }
}
