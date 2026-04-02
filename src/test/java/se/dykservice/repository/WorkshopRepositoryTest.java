package se.dykservice.repository;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import se.dykservice.IntegrationTest;

@IntegrationTest
class WorkshopRepositoryTest {

  @Autowired WorkshopRepository workshopRepository;
  @Autowired ServiceItemRepository serviceItemRepository;

  @Test
  void findAllReturnsSeededWorkshops() {
    var workshops = workshopRepository.findAll();
    assertThat(workshops).hasSize(2);
    assertThat(workshops).extracting("id").containsExactlyInAnyOrder("draktverkstan", "subnautica");
  }

  @Test
  void findByIdReturnsDraktverkstan() {
    var ws = workshopRepository.findById("draktverkstan");
    assertThat(ws).isPresent();
    assertThat(ws.get().warrantyYears()).isEqualTo(5);
    assertThat(ws.get().prioritySurchargePct()).isEqualTo(50);
  }

  @Test
  void findServicesForWorkshop() {
    var services = serviceItemRepository.findByWorkshopId("subnautica");
    assertThat(services).isNotEmpty();
    assertThat(services).allMatch(s -> s.workshopId().equals("subnautica"));
  }

  @Test
  void findServicesByNameAcrossWorkshops() {
    var services = serviceItemRepository.findByName("Neck seal latex");
    assertThat(services).hasSize(2);
    assertThat(services).extracting("workshopId")
        .containsExactlyInAnyOrder("draktverkstan", "subnautica");
  }
}
