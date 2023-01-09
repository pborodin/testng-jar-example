package my.home.web.ws;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class WsSessions {
    public static List<WebSocketSession> webSocketSessions = Collections.synchronizedList(new ArrayList<>());

    public static WebSocketSession getSessionById(String sessionId) {
        if(sessionId == null) return null;
        return webSocketSessions.stream()
                .filter(session -> sessionId.equals(session.getId()))
                .findAny()
                .orElse(null);
    }

    public static void sendMessageToAllSessions(String message) {
        for (WebSocketSession session : webSocketSessions) {
            try {
                if(session.isOpen()) session.sendMessage(new TextMessage("[ALL] " + message));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void sendMessageToSession(String message, WebSocketSession session) {
        if(session == null) return;
        TextMessage textMessage = new TextMessage("[" + webSocketSessions.indexOf(session) + "] " + message);
//        TextMessage textMessage = new TextMessage(message);
        try {
            if(session.isOpen()) session.sendMessage(textMessage);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
