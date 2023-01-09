package my.home.testrunner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.WebSocketSession;
import java.util.concurrent.*;

import static java.util.concurrent.Executors.newFixedThreadPool;

public class TestRunner {
    private static final Logger logger = LoggerFactory.getLogger(TestRunner.class);

    private static ExecutorService executorService = newFixedThreadPool(20);
    private static int testRunId = 0;

    public static synchronized Integer getNewTestRunId() {
        testRunId++;
        return testRunId;
    }
    public static void runTest(String testConfigFileName) {
        CallableTestSuite callableTestSuite = new CallableTestSuite(testConfigFileName);
        run(callableTestSuite);
    }

    public static void runTest(String testConfigFileName, WebSocketSession session) {
        CallableTestSuite callableTestSuite = new CallableTestSuite(testConfigFileName, session);
        run(callableTestSuite);
    }

    private static synchronized void run(CallableTestSuite callableTestSuite) {
        Future<String> future = executorService.submit(callableTestSuite);
    }

}
