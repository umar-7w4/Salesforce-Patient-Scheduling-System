public class EventController {
    @AuraEnabled(cacheable=true)
    public static List<Event> getEvents() {
        return [SELECT Id, Subject, StartDateTime, IsAllDayEvent, EndDateTime 
                FROM Event 
                ORDER BY CreatedDate DESC
                LIMIT 100];
    }
}