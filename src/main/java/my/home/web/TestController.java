package my.home.web;


import my.home.FileService;
import my.home.testrunner.TestRunner;
import my.home.web.ws.WsSessions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.WebSocketSession;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class TestController {
    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @GetMapping("/api/test/testConfigList")
    public String getTestConfigList() {

        Set<String> list = FileService.getListOfTestConfigFiles();
        if(list != null && !list.isEmpty()) list = list.stream()
                .map(st -> st.replaceAll("\\\\","/"))
                .collect(Collectors.toSet());
        if(list == null || list.isEmpty()) return "";
        return String.join("\n", list);
    }

    @GetMapping("/api/test/runTestConfig")
    public String runTestConfig(@RequestParam String testConfigFileName, @RequestParam(name = "sessionId", required = false) String sessionId) {
        if(sessionId == null || sessionId.isEmpty()) {
            TestRunner.runTest(testConfigFileName);
            return "Тест " + testConfigFileName + " запущен.";
        }

        WebSocketSession session = WsSessions.getSessionById(sessionId);
        if(session != null) {
            TestRunner.runTest(testConfigFileName, session);
            return "Тест " + testConfigFileName + " запущен. Сессия: " + session.getId();
        } else {
            logger.warn("Сессия {} не найдена! Запуск теста {}", sessionId, testConfigFileName);
            TestRunner.runTest(testConfigFileName);
            return "Тест " + testConfigFileName + " запущен.";
        }
    }

}
