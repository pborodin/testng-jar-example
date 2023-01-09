package my.home.testrunner;

import my.home.FileService;
import org.springframework.web.socket.WebSocketSession;
import org.testng.TestNG;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;

import static my.home.Config.TEST_CONFIG_FOLDER;
import static my.home.testrunner.TestRunner.getNewTestRunId;

public class CallableTestSuite implements Callable<String> {
    private String testConfigFileName;
    private WebsocketTestListener listener;
    private int testRunId = getNewTestRunId();
    private Thread thread;

    public CallableTestSuite(String testConfigFileName) {
        this.testConfigFileName = testConfigFileName;
        listener = new WebsocketTestListener(testConfigFileName, testRunId);
    }

    public CallableTestSuite(String testConfigFileName, WebSocketSession session) {
        this.testConfigFileName = testConfigFileName;
        listener = new WebsocketTestListener(session, testConfigFileName, testRunId);
    }

    public Thread getThread() {
        return thread;
    }

    public String getTestConfigFileName() {
        return testConfigFileName;
    }

    @Override
    public String call() throws Exception {
        thread = Thread.currentThread();
        TestNG testng = new TestNG();
        List<String> suites = new ArrayList<>();
        Path path = FileService.getAbsolutePathToFile(TEST_CONFIG_FOLDER + testConfigFileName);
        suites.add(path.toString());
        testng.setTestSuites(suites);
        testng.addListener(listener);
        testng.run();
        return "Tests from " + testConfigFileName + " finished";
    }
}
