package my.home.tests;

import org.testng.annotations.Test;

import java.util.Properties;
import java.util.concurrent.ThreadLocalRandom;

public class DummyTest {

    @Test
    public void dummyTest1() {
        System.out.println("dummyTest1 ----------------- ");
        try {
//            Thread.sleep(ThreadLocalRandom.current().nextInt(1000, 9000));
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void dummyTest2() {
        System.out.println("dummyTest2 ================= ");
        try {
//            Thread.sleep(ThreadLocalRandom.current().nextInt(1000, 9000));
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void dummyTest3() {
        System.out.println("dummyTest3 ================= ");
        try {
//            Thread.sleep(ThreadLocalRandom.current().nextInt(1000, 9000));
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
//        Properties prop = System.getProperties();
//        prop.entrySet().forEach(p -> {
//            System.out.println(p.getKey() + "=" + p.getValue());
//        });
    }


}
