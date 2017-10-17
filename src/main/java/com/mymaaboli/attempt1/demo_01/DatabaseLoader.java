package com.mymaaboli.attempt1.demo_01;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component()
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
    }
}
