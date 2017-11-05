package personal.mmb.demo_00.demo_00;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data
@Entity
public class Gurdwara {

    private @Id @GeneratedValue Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private int zipcode;
    private String country_code;

    private Gurdwara() {}

    public Gurdwara(String name, String address, String city, String state, int zipcode, String country_code) {
        this.name = name;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
        this.country_code = country_code;
    }
}
