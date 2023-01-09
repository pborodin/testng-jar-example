package my.home.web.ws;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

import static my.home.web.ws.WsSessions.webSocketSessions;

@Component
public class WsTextHandler extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(TextWebSocketHandler.class);

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        webSocketSessions.add(session);
        logger.info("Открыта ws сессия: {}", session.getId());
        logger.info("Количество ws сессий: {}", webSocketSessions.size());
        session.sendMessage(new TextMessage("sessionId=" + session.getId()));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
        webSocketSessions.remove(session);
        logger.info("Количество ws сессий: {}", webSocketSessions.size());
    }


    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String payload = message.getPayload();
        logger.info("Обрабатываем сообщение: {}", payload);
        session.sendMessage(new TextMessage("Обработано сообщение:  " + payload));
    }

//    @Override
//    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
//        System.out.println("handleMessage");
//        super.handleMessage(session, message);
//        session.sendMessage(new TextMessage("received message:  " + message.getPayload()));
//    }

}
