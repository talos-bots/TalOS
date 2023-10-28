import { writeFileSync, existsSync, readFileSync } from 'fs';
import { TalOSEvent, TalOSEventType } from './TalOSEvent';
import { eventLogsPath, expressAppIO } from '..';
export class TalOSEventLogger {
    logEvent(event: TalOSEvent) {
        const date = new Date(event.timestamp);
        const fileName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log.json`;
        const filePath = `${eventLogsPath}/${fileName}`;
        let events: TalOSEvent[] = [];
        if (existsSync(fileName)) {
            const fileContent = readFileSync(filePath, 'utf-8');
            events = JSON.parse(fileContent);
        }
        events.push(event);
        writeFileSync(filePath, JSON.stringify(events, null, 2));
        expressAppIO.emit(`event-log-update`, events);
    }
}