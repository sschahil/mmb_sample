package personal.mmb.demo_00.demo_00;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner{

    private final GurdwaraRepository repository;

    @Autowired
    public DatabaseLoader(GurdwaraRepository repository) {
        this.repository = repository;
    }


    @Override
    public void run(String... args) throws Exception {
        this.repository.save(new Gurdwara("Gur Nanak Parkash", "16101 W Grant Line Rd", "Tracy",
                "California", 95304, "USA"));
        this.repository.save(new Gurdwara("Gurdwara Sahib Tracy", "11770 W Clover Rd", "Tracy",
                "California", 95304, "USA"));
        this.repository.save(new Gurdwara("Gurdwara Gurmat Parkash Manteca", "4640 Woodward Ave", "Manteca",
                "California", 95377, "USA"));
        this.repository.save(new Gurdwara("Gurdwara Sahib Sikh Temple", "1930 S Grant St", "Stockton",
                "California", 95206, "USA"));
        this.repository.save(new Gurdwara("Livermore Gurdwara", "2089 N Livermore Ave", "Livermore",
                "California", 94551, "USA"));
        this.repository.save(new Gurdwara("Gurdwara Sahib of Hayward", "1805 Hill Ave", "Hayward",
                "California", 94541, "USA"));
    }
}
