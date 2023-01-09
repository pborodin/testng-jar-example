package my.home.web.ws;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class WsAppender extends AppenderBase<ILoggingEvent> {
    @Override
    protected void append(ILoggingEvent event) {
        Date date = new Date(event.getTimeStamp());
        DateFormat formatter = new SimpleDateFormat("HH:mm:ss.SSS");
        String time = formatter.format(date) + " ";

        String threadName = "[" + event.getThreadName() + "] ";

        WsSessions.sendMessageToAllSessions(time + threadName + event.getFormattedMessage());
    }
}
