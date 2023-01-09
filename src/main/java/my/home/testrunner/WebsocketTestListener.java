package my.home.testrunner;

import my.home.web.ws.WsSessions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.WebSocketSession;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

public class WebsocketTestListener implements ITestListener {
    private static final Logger logger = LoggerFactory.getLogger(WebsocketTestListener.class);

    private String suiteName = "";
    private WebSocketSession session = null;
    private String testConfigName = null;
    private Integer testRunID = 0;

    private void log(String eventName, ITestResult result) {
        String st = "[" + Thread.currentThread().getId() + "] ";
        st += "[id=" + testRunID + "] ";
        st+= eventName + " - ";
        st+= "(" + testConfigName + " - " + result.getMethod().getMethodName() + ")";
        logger.info(st);
    }

    private void log(String eventName) {
        String st = "[" + Thread.currentThread().getId() + "] ";
        st += "[id=" + testRunID + "] ";
        st+= eventName + " - ";
        st+= "(" + testConfigName + ")";
        logger.info(st);
    }

    private void sendMessage(String message) {
        if(session == null) {
            WsSessions.sendMessageToAllSessions(message);
        } else {
            WsSessions.sendMessageToSession(message, session);
        }
    }

    public WebsocketTestListener(String testConfigName, Integer testRunID) {
        this.testConfigName = testConfigName;
        this.testRunID = testRunID;
    }

    public WebsocketTestListener(WebSocketSession session, String testConfigName, Integer testRunID) {
        this.session = session;
        this.testConfigName = testConfigName;
        this.testRunID = testRunID;
    }

    @Override
    public void onStart(ITestContext context) {
        suiteName = context.getCurrentXmlTest().getSuite().getName();
        log("onStart");

        // отправляем сообщение клиенту, для отображения спинера
        sendMessage("testStarted:" + testRunID + ":" + testConfigName);
    }

    @Override
    public void onFinish(ITestContext testContext) {
        log("onFinish");

        logger.info("PASSED TEST CASES");
        testContext.getPassedTests().getAllResults()
                .forEach(result -> {
                    logger.info(result.getName());
                });

        logger.info("FAILED TEST CASES");
        testContext.getFailedTests().getAllResults()
                .forEach(result -> {
                    logger.info(result.getName());
                });

        logger.info("Test completed on: " + testContext.getEndDate().toString());

        // отправляем команду клиенту, для выключения спинера
        sendMessage("testFinished:" + testRunID + ":" + testConfigName);
    }

    @Override
    public void onTestStart(ITestResult result) {
        log("onTestStart", result);
//        logger.info("Запущен тест: " + suiteName + "/" +result.getName());
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        log("onTestSuccess", result);
//        logger.info("Тест пройден: " + suiteName + "/" +result.getName());
    }

    @Override
    public void onTestFailure(ITestResult result) {
        log("onTestFailure", result);
//        logger.info("Тест ПРОВАЛЕН!: " + suiteName + "/" +result.getName());
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        log("onTestSkipped", result);
//        logger.info("Тест пропущен: " + suiteName + "/" +result.getName());
    }

    @Override
    public void onTestFailedWithTimeout(ITestResult result) {
        log("onTestFailedWithTimeout");
//        logger.info("Тест ПРОВАЛЕН по таймауту: " + suiteName + "/" +result.getName());
    }

    //...
}
